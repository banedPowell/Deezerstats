WITH song_listening AS (
  SELECT
    song_id,
    SUM(listening_time) AS total_listening_time
  FROM plays
  WHERE
    plays.user_id = '2dea5089-a5d1-48ab-913f-98f3b3a06ed4'
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
ORDER BY sl.total_listening_time DESC
LIMIT 10;
