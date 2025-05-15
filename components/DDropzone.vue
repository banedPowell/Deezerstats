<script lang="ts" setup>
	import * as XLSX from 'xlsx';

	const isLoading = ref(false);
	const fileInput = ref<HTMLInputElement | null>(null);
	const file = ref();
	const isFileReady = computed(() => !!file.value);

	const session = useSupabaseSession();

	const handleFileInput = async (event: Event) => {
		isLoading.value = true;

		const target = event.target as HTMLInputElement;
		const fileToProcess = target.files?.[0];

		if (!fileToProcess) return;

		try {
			// 1. Lecture du fichier Excel
			const data = await fileToProcess.arrayBuffer();
			const workbook = XLSX.read(data, { type: 'array' });

			// 2. Récupération de la feuille
			const sheetName = '10_listeningHistory';
			const worksheet = workbook.Sheets[sheetName];

			if (!worksheet) {
				return;
			}

			// 3. Transformation de la feuille en JSON
			file.value = XLSX.utils.sheet_to_json(worksheet);
		} catch (err: any) {
			console.error(
				'Erreur lors du traitement du fichier :',

				err.message,
			);
		} finally {
			isLoading.value = false;
		}
	};

	const removeFile = () => {
		file.value = null;
	};

	const response = ref('');

	const submit = async () => {
		isLoading.value = true;

		const res = await $fetch('/api/files/uploadListeningHistory', {
			method: 'POST',
			body: { files: file.value },
			headers: {
				Authorization: `Bearer ${session.value?.access_token}`,
			},
		});

		if (res) {
			isLoading.value = false;
			response.value = res;
			removeFile();
		}
	};
</script>

<template>
	<div class="dropzone">
		<p v-if="isFileReady">Fichier prêt</p>

		<label v-else class="dropzone__label">
			Choisissez un fichier
			<input
				ref="fileInput"
				accept=".xlsx,.xls"
				type="file"
				@input="handleFileInput"
			/>
		</label>
	</div>

	<div v-if="isFileReady" class="actions">
		<div v-if="isLoading" class="actions">
			<DButton :disabled="isLoading" size="small" type="primary">
				Envoyer
			</DButton>

			<DButton :disabled="isLoading" size="small" type="secondary">
				Supprimer le fichier
			</DButton>
		</div>

		<div v-else class="actions">
			<DButton size="small" type="primary" @click="submit">
				Envoyer
			</DButton>

			<DButton
				:disabled="isLoading"
				size="small"
				type="secondary"
				@click="removeFile"
			>
				Supprimer le fichier
			</DButton>
		</div>
	</div>

	<div v-else class="actions">
		<DButton disabled size="small" type="primary">Envoyer</DButton>
		<DButton disabled size="small" type="secondary"
			>Supprimer le fichier
		</DButton>
	</div>

	<div v-if="isLoading && !isFileReady" class="loading">
		<Icon name="lucide:loader" />
		Attendez la fin du traitement du fichier...
	</div>

	<div v-if="isLoading && isFileReady" class="loading">
		<Icon name="lucide:loader" />
		Envoi en cours
	</div>

	<p class="response" v-if="response">{{ response }}</p>
</template>

<style lang="scss" scoped>
	.dropzone {
		width: 100%;
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20px;
		border: 1px dashed $strokes;
		user-select: none;

		&__label {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			border-radius: 20px;
			background: $bg-2;
			color: $text;
			cursor: pointer;
		}
	}

	.actions {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 10px;

		width: fit-content;
	}

	.loading {
		font-size: 1.4rem;
	}

	.response {
		font-size: 1.4rem;
		color: $text;
	}

	input[type='file'] {
		display: none;
	}
</style>
