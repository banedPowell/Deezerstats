<script lang="ts" setup>
	import * as XLSX from 'xlsx';
	import { Icon } from '@iconify/vue';

	const isLoading = ref(false);
	const fileInput = ref<HTMLInputElement | null>(null);
	const file = ref();
	const isFileReady = computed(() => !!file.value);
	const isDragging = ref(false);
	const isVisible = ref(true);

	const session = useSupabaseSession();

	const processFile = async (fileToProcess: File) => {
		isLoading.value = true;

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

	const handleFileInput = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const fileToProcess = target.files?.[0];

		if (fileToProcess) {
			await processFile(fileToProcess);
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
		isDragging.value = true;
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
		isDragging.value = false;
	};

	const handleDrop = async (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
		isDragging.value = false;

		const droppedFiles = event.dataTransfer?.files;
		if (droppedFiles && droppedFiles.length > 0) {
			const fileToProcess = droppedFiles[0];
			// Vérifier si c'est un fichier Excel
			if (
				fileToProcess.name.endsWith('.xlsx') ||
				fileToProcess.name.endsWith('.xls')
			) {
				await processFile(fileToProcess);
			}
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
			emit('fileSent');

			setTimeout(() => {
				isVisible.value = false;
			}, 1000);
		}
	};

	const test = ref(true);

	const emit = defineEmits(['fileSent']);
</script>

<template>
	<Transition name="fade">
		<div class="dropzone__wrapper" v-if="isVisible">
			<div
				class="dropzone"
				:class="{ 'dropzone--dragging': isDragging, test: test }"
				@dragover="handleDragOver"
				@dragleave="handleDragLeave"
				@drop="handleDrop"
			>
				<p v-if="isFileReady">Fichier prêt</p>

				<label v-else class="dropzone__label">
					<span v-if="isDragging">Déposez votre fichier ici</span>
					<span v-else>Choisissez un fichier ou glissez-le ici</span>
					<span v-if="isLoading && !isFileReady" class="loading">
						<Icon
							class="turning-icon"
							icon="lucide:loader"
							:ssr="true"
						/>
						Attendez la fin du traitement du fichier...
					</span>
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

					<DButton
						:disabled="isLoading"
						size="small"
						type="secondary"
					>
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

			<div v-if="isLoading && isFileReady" class="loading">
				<Icon class="turning-icon" icon="lucide:loader" :ssr="true" />
				Envoi en cours
			</div>

			<p class="response" v-if="response">{{ response }}</p>
		</div>
	</Transition>
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
		transition: all 0.2s ease;

		&--dragging {
			border: 2px dashed $primary;
			background-color: rgba($primary, 0.05);
		}

		&__wrapper {
			display: flex;
			flex-direction: column;
			gap: 30px;

			width: 100%;
		}

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

	.turning-icon {
		animation: turning 1s linear infinite;
	}

	@keyframes turning {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
