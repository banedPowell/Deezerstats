export type UserPayload = {
	username: string;
	password: string;
};

export type UserInAuthStore = {
	name: string | null;
	username: string | null;
	token: string | null;
};

const useAuthStore = defineStore('auth', () => {
	const loading = ref(false);

	const userCookie = useCookie<UserInAuthStore>('user', {
		default: () => ({
			name: null,
			username: null,
			token: null,
		}),
	});

	const user = ref<UserInAuthStore>(userCookie.value);

	const isAuthenticated = computed(() => !!user.value.token);

	const saveUserToStore = (data: Ref<UserInAuthStore>) => {
		user.value = {
			name: data.value.name,
			username: data.value.username,
			token: data.value.token,
		};
	};

	const saveUserToCookie = () => {
		userCookie.value = {
			name: user.value.name,
			username: user.value.username,
			token: user.value.token,
		};
	};

	const resetUser = () => {
		user.value = {
			name: null,
			username: null,
			token: null,
		};

		saveUserToCookie();
	};

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
			saveUserToStore(data);
			saveUserToCookie();
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
			saveUserToStore(data);
			saveUserToCookie();
			loading.value = false;
		}
	};

	const logout = () => {
		loading.value = true;
		resetUser();
		loading.value = false;
	};

	return {
		user,
		isAuthenticated,
		loading,
		signup,
		login,
		logout,
	};
});

export { useAuthStore };
