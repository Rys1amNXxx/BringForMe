<template>
  <div class="messages-page">

    <MessagesComponent />


    <div class="delivery-list">
      <h3>Delivery Information</h3>
      <div v-for="delivery in deliveries" :key="delivery.id" class="delivery-item">
        <div class="delivery-header" @click="toggleDelivery(delivery.id)">
          <strong>{{ delivery.name }}</strong>
          <span class="delivery-time">{{ delivery.time }}</span>
        </div>
        <div v-if="expandedDelivery === delivery.id" class="delivery-content">
          <p>{{ delivery.content }}</p>
          <img v-if="delivery.image" :src="delivery.image" alt="Delivery Image" class="delivery-image" />
          <div class="delivery-actions">
            <el-button size="small">Contact Now</el-button>
            <el-button size="small" type="success">Accept</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MessagesComponent from '@/components/MessagesComponent.vue'


const deliveries = ref([
  {
    id: 1,
    name: 'Delivery Person 1',
    time: '5m',
    content: 'Delivery to 123 Main St, New York, USA',
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 2,
    name: 'Delivery Person 2',
    time: '15m',
    content: 'Delivery to 456 Elm St, Los Angeles, USA',
    image: 'https://via.placeholder.com/300x200'
  }
])


const expandedDelivery = ref(null)


function toggleDelivery(id) {
  expandedDelivery.value = expandedDelivery.value === id ? null : id
}
</script>

<style scoped>
.messages-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.delivery-list {
  margin-top: 20px;
}

.delivery-item {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
}

.delivery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.delivery-time {
  font-size: 12px;
  color: #999;
}

.delivery-content {
  margin-bottom: 10px;
}

.delivery-image {
  max-width: 100%;
  margin-top: 10px;
  border: 1px solid #ddd;
}

.delivery-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>
