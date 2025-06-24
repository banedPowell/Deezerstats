create or REPLACE FUNCTION get_albums_stats_by_user(
        p_user_id uuid,
        p_order_by text default 'listening_time',
        p_order text default 'DESC',
        p_limit integer default 10,
        p_page integer default 1
    ) RETURNS TABLE (
        album_id bigint,
        album_title text,
        artist_id bigint,
        artist_name text,
        total_listening_time bigint,
        total_streams bigint
    ) as $$
DECLARE order_column text;
order_direction text;
page_offset integer;
BEGIN page_offset := p_limit * (p_page - 1);
IF lower(p_order_by) = 'stream_count' THEN order_column := 'total_streams';
ELSE order_column := 'total_listening_time';
END IF;
IF upper(p_order) = 'ASC' THEN order_direction := 'ASC';
ELSE order_direction := 'DESC';
END IF;
return QUERY EXECUTE format(
    $f$ WITH track_listens AS (
        SELECT s.track_id,
            COUNT(*) AS stream_count,
            SUM(s.listening_time) AS total_listening_time
        FROM streams s
        WHERE s.user_id = %L
        GROUP BY s.track_id
    )
    SELECT al.id AS album_id,
        al.title AS album_title,
        ar.id as artist_id,
        ar.name AS artist_name,
        COALESCE(SUM(tl.total_listening_time), 0)::bigint AS total_listening_time,
        COALESCE(SUM(tl.stream_count), 0)::bigint AS total_streams
    FROM albums al
        JOIN artists ar ON al.artist_id = ar.id
        LEFT JOIN tracks t ON t.album_id = al.id
        LEFT JOIN track_listens tl ON tl.track_id = t.id
    GROUP BY al.id,
        al.title,
        ar.name,
        ar.id
    ORDER BY %I %s
    Limit %s offset %s $f$,
        p_user_id,
        order_column,
        order_direction,
        p_limit,
        page_offset
);
end $$ LANGUAGE plpgsql