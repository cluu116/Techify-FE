<template>
  <div id="fpt-ai-chatbot"></div>
</template>

<script setup>
import { onMounted } from 'vue';

// Configs
const liveChatBaseUrl = document.location.protocol + '//' + 'livechat.fpt.ai/v36/src';
const LiveChatSocketUrl = 'livechat.fpt.ai:443';
const FptAppCode = '39af529d96038caac4b9418089e0b810';
const FptAppName = 'Techify';

// Define custom styles
const CustomStyles = {
  // header
  headerBackground: 'linear-gradient(86.7deg, #3353a2ff 0.85%, #31b7b7ff 98.94%)',
  headerTextColor: '#ffffffff',
  headerLogoEnable: false,
  headerLogoLink: 'https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png',
  headerText: 'Hỗ trợ trực tuyến',
  // main
  primaryColor: '#6d9ccbff',
  secondaryColor: '#ecececff',
  primaryTextColor: '#ffffffff',
  secondaryTextColor: '#000000DE',
  buttonColor: '#b4b4b4ff',
  buttonTextColor: '#ffffffff',
  bodyBackgroundEnable: false,
  bodyBackgroundLink: '',
  avatarBot: 'https://chatbot-tools.fpt.ai/livechat-builder/img/bot.png',
  sendMessagePlaceholder: 'Nhập tin nhắn',
  // float button
  floatButtonLogo: 'https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png',
  floatButtonTooltip: 'FPT.AI xin chào',
  floatButtonTooltipEnable: false,
  // start screen
  customerLogo: 'https://chatbot-tools.fpt.ai/livechat-builder/img/bot.png',
  customerWelcomeText: 'Vui lòng nhập tên của bạn',
  customerButtonText: 'Bắt đầu',
  prefixEnable: false,
  prefixType: 'radio',
  prefixOptions: ["Anh","Chị"],
  prefixPlaceholder: 'Danh xưng',
  // custom css
  css: ''
};

// Set Configs
const FptLiveChatConfigs = {
  appName: FptAppName,
  appCode: FptAppCode,
  themes: '',
  styles: CustomStyles
};

onMounted(() => {
  // Append Script
  const FptLiveChatScript = document.createElement('script');
  FptLiveChatScript.id = 'fpt_ai_livechat_script';
  FptLiveChatScript.src = liveChatBaseUrl + '/static/fptai-livechat.js';
  document.body.appendChild(FptLiveChatScript);

  // Append Stylesheet
  const FptLiveChatStyles = document.createElement('link');
  FptLiveChatStyles.id = 'fpt_ai_livechat_script';
  FptLiveChatStyles.rel = 'stylesheet';
  FptLiveChatStyles.href = liveChatBaseUrl + '/static/fptai-livechat.css';
  document.body.appendChild(FptLiveChatStyles);

  // Init
  FptLiveChatScript.onload = function () {
    window.fpt_ai_render_chatbox(FptLiveChatConfigs, liveChatBaseUrl, LiveChatSocketUrl);
  };
});
</script>

<style scoped>
/* Thêm styles nếu cần */
</style>