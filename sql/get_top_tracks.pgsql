CREATE OR REPLACE FUNCTION get_top_tracks(
    p_user_id uuid,
    p_order_by text default 'listening_time',
    p_order text default 'desc',
    p_limit integer default 10
) 
RETURNS TABLE (
  artist_id bigint,
  artist_name text,
  total_streams bigint,
  total_listening_time bigint
)
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
  
  WITH song_listening AS (
    SELECT
      song_id,
      SUM(listening_time) AS total_listening_time
    FROM plays
    WHERE
      plays.user_id = %s
    GROUP BY song_id
  )
  SELECT
    s.id AS song_id,
    s.title AS song_title,
    STRING_AGG(DISTINCT a.name, ', ' ORDER BY a.name) AS artist_names,
    sl.total_listening_time
  FROM song_listening sl
  JOIN songs s ON sl.song_id = s.id
  LEFT JOIN song_artists sa ON s.id = sa.song_id
  LEFT JOIN artists a ON sa.artist_id = a.id
  GROUP BY s.id, s.title, sl.total_listening_time
  ORDER BY sl.total_listening_time p_order
  LIMIT p_limit;
  $f$,
  p_user_id,
  

  )


END
$$ 
LANGUAGE plpgsql