CREATE OR REPLACE FUNCTION get_tracks_stats_by_user(
		p_user_id uuid,
		p_order_by text default 'listening_time',
		p_order text default 'desc',
		p_limit integer default 10,
		p_page integer default 1
	) RETURNS TABLE (
		track_id bigint,
		track_isrc text,
		track_name text,
		artist_ids bigint [],
		artist_names text [],
		total_streams bigint,
		total_listening_time bigint
	) AS $$
DECLARE order_column text;
order_direction text;
page_offset integer;
BEGIN page_offset := (p_page -1) * p_limit;
IF lower(p_order_by) = 'stream_count' THEN order_column := 'total_streams';
ELSE order_column := 'total_listening_time';
END IF;
IF upper(p_order) = 'ASC' THEN order_direction := 'ASC';
ELSE order_direction := 'DESC';
END IF;
RETURN QUERY EXECUTE format(
	$f$ WITH track_listening AS (
		SELECT s.track_id,
			COUNT(*) AS total_streams,
			SUM(s.listening_time) AS total_listening_time
		FROM streams s
		WHERE s.user_id = %L
		GROUP BY s.track_id
	)
	SELECT t.id AS track_id,
		t.isrc AS track_isrc,
		t.title AS track_name,
		ARRAY_AGG(DISTINCT a.id::bigint) AS artist_ids,
		ARRAY_AGG(DISTINCT a.name) AS artist_names,
		tl.total_streams,
		tl.total_listening_time
	FROM track_listening tl
		JOIN tracks t ON tl.track_id = t.id
		LEFT JOIN track_artists ta ON t.id = ta.track_id
		LEFT JOIN artists a ON ta.artist_id = a.id
	GROUP BY t.id,
		t.title,
		t.isrc,
		tl.total_streams,
		tl.total_listening_time
	ORDER BY %I %s
	LIMIT %s offset %s;
$f$,
p_user_id,
order_column,
order_direction,
p_limit,
page_offset
);
END $$ LANGUAGE plpgsql