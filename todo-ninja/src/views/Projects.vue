<template>
  <div class="projects">
    <button @click="addProject('127.0.0.1')">Add Test Project</button>

    <h1 class="subheading grey--text">Projects</h1>

    <v-container class="my-5">
      <v-expansion-panel>
        <v-expansion-panel-content v-for="project in projects" :key="project.title">
          <div slot="header" class="py-1">{{ project.title }}</div>
          <v-card>
            <v-card-text class="px-4 grey--text">
              <div class="font-weight-bold">Due by {{ project.due }}</div>
              <div>{{ project.content }}</div>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      ws: null,
    };
  },
  mounted() {
    this.connectWebSocket();
  },
  methods: {
    connectWebSocket() {
      this.ws = new WebSocket('ws://localhost:8080');

      this.ws.onopen = () => {
        console.log('Connection opened');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'newClient') {
          this.addProject(data.ip, data.message);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    },
    addProject(ip, message) {
      this.projects.push({
        title: `Client: ${ip}`,
        person: ip,
        due: 'N/A',
        status: 'connected',
        content: message
      });
    }
  },
  beforeDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
