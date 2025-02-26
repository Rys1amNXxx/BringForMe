<template>
  <div class="task-container">
    <el-tabs v-model="activeTab" type="card">
      <!-- Accepted Tasks Tab -->
      <el-tab-pane label="Accepted" name="accepted">
        <div class="task-list">
          <template v-if="acceptedTasks.length">
            <div v-for="task in acceptedTasks" :key="task.id" class="task-item">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
              <p class="reward">Reward: ￡{{ task.reward }}</p>
            </div>
          </template>
          <template v-else>
            <div class="empty-state">
              There are no accepted tasks yet.
            </div>
          </template>
        </div>
      </el-tab-pane>

      <!-- Published Tasks Tab -->
      <el-tab-pane label="Published" name="published">
        <div class="task-list">
          <template v-if="publishedTasks.length">
            <div v-for="task in publishedTasks" :key="task.id" class="task-item">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
              <p class="reward">Reward: ￡{{ task.reward }}</p>
            </div>
          </template>
          <template v-else>
            <div class="empty-state">
              There are no published tasks yet.
            </div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const activeTab = ref('accepted')
const acceptedTasks = inject('acceptedTasks')
const publishedTasks = ref([])


onMounted(() => {
  // Fetch accepted tasks from the API
  axios.get('http://localhost:3000/api/acceptedTasks')
    .then((res) => {
      acceptedTasks.value = res.data
    })
    .catch((err) => {
      console.error('Getting accepted tasks failed:', err)
    })

  // Fetch published tasks from the API
  axios.get('http://localhost:3000/api/publishedTasks')
    .then((res) => {
      publishedTasks.value = res.data
    })
    .catch((err) => {
      console.error('Getting published tasks failed:', err)
    })
})
</script>

<style scoped>
.task-container {
  padding: 20px;
}

.task-list {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #ffffff;
}

.task-item h3 {
  margin: 0 0 8px;
}

.task-item p {
  margin: 4px 0;
}

.reward {
  color: #67c23a;
  font-weight: bold;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #909399;
}
</style>
