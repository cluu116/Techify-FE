<template>
  <div class="google-callback">
    <p>Processing Google login...</p>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: 'GoogleCallback',
  setup() {
    const router = useRouter();
    const store = useStore();

    const processGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/auth/oauth2/callback/google?code=${code}`);
          const token = response.data.token;
          await store.dispatch('auth/loginSuccess', token);
          router.push('/dashboard');
        } catch (error) {
          console.error('Google login error:', error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    processGoogleCallback();

    return {};
  }
}
</script>