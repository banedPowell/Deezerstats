CREATE OR REPLACE FUNCTION get_artists_stats_by_user(
		p_user_id uuid,
		p_order_by text DEFAULT 'listening_time',
		p_order text DEFAULT 'DESC',
		p_limit integer DEFAULT 10,
		p_page integer default 1
	) RETURNS TABLE (
		artist_id bigint,
		artist_name text,
		total_streams bigint,
		total_listening_time bigint
	) LANGUAGE plpgsql AS $$
DECLARE order_column text;
order_direction text;
page_offset integer;
BEGIN IF lower(p_order_by) = 'stream_count' THEN order_column := 'total_streams';
ELSE order_column := 'total_listening_time';
END IF;
IF upper(p_order) = 'ASC' THEN order_direction := 'ASC';
ELSE order_direction := 'DESC';
END IF;
page_offset := (p_page - 1) * p_limit;
RETURN QUERY EXECUTE format(
	$f$ WITH track_listens AS (
		SELECT s.track_id,
			COUNT(*) AS stream_count,
			SUM(s.listening_time) AS total_listening_time
		FROM streams s
		WHERE s.user_id = %L
		GROUP BY s.track_id
	)
	SELECT ar.id AS artist_id,
		ar.name AS artist_name,
		COALESCE(SUM(sl.stream_count)::bigint, 0) AS total_streams,
		COALESCE(SUM(sl.total_listening_time)::bigint, 0) AS total_listening_time
	FROM artists ar
		LEFT JOIN track_artists sa ON sa.artist_id = ar.id
		LEFT JOIN track_listens sl ON sl.track_id = sa.track_id
	GROUP BY ar.id,
		ar.name
	ORDER BY %s %s
	LIMIT %s offset %s;
$f$,
p_user_id,
order_column,
order_direction,
p_limit,
page_offset
);
END;
$$;