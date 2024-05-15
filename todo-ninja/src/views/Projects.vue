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
        // Send identification message to the server
        this.ws.send(JSON.stringify({
          type: 'identify',
          clientType: 'monitoring-client'
        }));        
      };

      this.ws.onmessage = (event) => {
        // Handle messages from the server
        const data = JSON.parse(event.data);
        if (data.type === 'updateClients') {
          // Reset the projects list on each update
          //this.projects = []; // Clear previous data or handle updates differently if needed
          //data.clients.forEach(client => {
          //  this.addProject(client.ip, `Client connected with IP: ${client.ip}`);
          //});
          this.projects = data.clients.map(client => ({
            title: `Client: ${client.ip}`,
            person: client.id, // Using client.id as a key
            due: 'N/A',
            status: 'connected',
            content: `Client connected with IP: ${client.ip}`
          }));
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
  },
  /*
  addProject(ip, message) {
    this.projects.push({
      title: `Client: ${ip}`,
      person: ip,
      due: 'N/A',
      status: 'connected',
      content: message
    });
  },
  */
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
