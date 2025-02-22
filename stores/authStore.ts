export type UserPayload = {
	username: string;
	password: string;
};

const useAuthStore = defineStore('auth', () => {
	const userId: Ref<string | null> = ref(null);
	const name: Ref<string | null> = ref(null);
	const uName: Ref<string | null> = ref(null);
	const token: Ref<string | null> = ref(null);

	const loading = ref(false);

	const isAuthenticated = computed(() => !!token.value);

	const signup = async ({ username, password }: UserPayload) => {
		loading.value = true;
		const data = ref();
		data.value = await $fetch('/auth/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				username,
				password,
			},
		});

		if (data.value) {
			userId.value = data.value.userId;
			name.value = data.value.name;
			uName.value = data.value.username;
			token.value = data.value.token;
			loading.value = false;
		}
	};

	const login = async ({ username, password }: UserPayload) => {
		loading.value = true;
		const data = ref();
		data.value = await $fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				username,
				password,
			},
		});

		if (data.value) {
			userId.value = data.value.userId;
			name.value = data.value.name;
			uName.value = data.value.username;
			token.value = data.value.token;
			loading.value = false;
		}
	};
	const logout = () => {
		token.value = null;
		userId.value = null;
		uName.value = null;
	};

	return {
		userId,
		name,
		uName,
		token,
		isAuthenticated,
		signup,
		login,
		logout,
	};
});

export { useAuthStore };
