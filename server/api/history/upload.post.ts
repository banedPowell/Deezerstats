import { RawFileDatas } from '~/types';

export default defineEventHandler(async (event) => {
	const userId = event.context.auth;

	if (!userId) {
		setResponseStatus(event, 401, 'Utilisateur non authentifié');
		return 'Utilisateur non authentifié';
	}

	const body = await readBody(event);
	const rawFile: RawFileDatas[] = Array.isArray(body.files)
		? body.files
		: body;

	// $fetch('/api/internal/processHistoryDatas', {
	// 	method: 'POST',
	// 	body: { rawFile, userId },
	// }).catch((err) => {
	// 	console.error('Erreur lors de l’appel interne', err);
	// });
	await processListeningHistoryDatas(rawFile, userId);

	// Réponse immédiate
	setResponseStatus(event, 200, 'Fichier téléchargé avec succès !');
	return 'Fichier téléchargé avec succès !';
});
