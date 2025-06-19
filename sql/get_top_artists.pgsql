CREATE OR REPLACE FUNCTION get_top_artists_by_user(
    p_user_id uuid,
    p_order_by text DEFAULT 'listening_time',
    p_order text DEFAULT 'DESC',
    p_limit integer DEFAULT 10
)
RETURNS TABLE (
    artist_id bigint,
    artist_name text,
    total_plays bigint,
    total_listening_time bigint
)
LANGUAGE plpgsql
AS $$
DECLARE
    order_column text;
    order_direction text;
BEGIN
    IF lower(p_order_by) = 'play_count' THEN
        order_column := 'total_plays';
    ELSE
        order_column := 'total_listening_time';
    END IF;

    IF upper(p_order) = 'ASC' THEN
        order_direction := 'ASC';
    ELSE
        order_direction := 'DESC';
    END IF;

    RETURN QUERY EXECUTE format(
        $f$
        WITH song_listens AS (
          SELECT
            p.song_id,
            COUNT(*) AS play_count,
            SUM(p.listening_time) AS total_listening_time
          FROM
            plays p
          WHERE
            p.user_id = %L
          GROUP BY
            p.song_id
        )

        SELECT
          ar.id AS artist_id,
          ar.name AS artist_name,
          COALESCE(SUM(sl.play_count)::bigint, 0) AS total_plays,
          COALESCE(SUM(sl.total_listening_time)::bigint, 0) AS total_listening_time
        FROM
          artists ar
        LEFT JOIN
          song_artists sa ON sa.artist_id = ar.id
        LEFT JOIN
          song_listens sl ON sl.song_id = sa.song_id
        GROUP BY
          ar.id, ar.name
        ORDER BY
          %s %s
        LIMIT %s
        $f$,
        p_user_id,
        order_column,
        order_direction,
        p_limit
    );
END;
$$;