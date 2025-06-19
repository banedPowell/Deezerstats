WITH song_listens AS (
  SELECT
    p.song_id,
    COUNT(*) AS play_count,
    SUM(p.listening_time) AS total_listening_time
  FROM
    plays p
  WHERE
    p.user_id = '2dea5089-a5d1-48ab-913f-98f3b3a06ed4'
  GROUP BY
    p.song_id
)

SELECT
  ar.id AS artist_id,
  ar.name AS artist_name,
  COALESCE(SUM(sl.play_count), 0) AS total_plays,
  COALESCE(SUM(sl.total_listening_time), 0) AS total_listening_time
FROM
  artists ar
LEFT JOIN
  song_artists sa ON sa.artist_id = ar.id
LEFT JOIN
  song_listens sl ON sl.song_id = sa.song_id
GROUP BY
  ar.id, ar.name
ORDER BY
  total_listening_time DESC
limit 10
