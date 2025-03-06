<template>
  <div class="task-container">
    <el-tabs v-model="activeTab" type="card">
      <!-- Accepted Tasks Tab -->
      <el-tab-pane label="Accepted" name="accepted">
        <div class="task-list">
          <template v-if="acceptedTasks.length">
            <div v-for="order in acceptedTasks" :key="order.id" class="task-item">
              <h3>Order #{{ order.id }}</h3>
              <p>Description: {{ order.description }}</p>
              <p>Status: {{ order.status === 1? 'Accepted' : 'Awaiting Accept' }}</p>
              <p class="reward">Reward: ￡{{ order.commission }}</p>
              <p>Acceptor: {{ order.acceptor }}</p>
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
            <div v-for="order in publishedTasks" :key="order.id" class="task-item">
              <h3>Order #{{ order.id }}</h3>
              <p>Description: {{ order.description }}</p>
              <p>Status: {{ order.status === 1? 'Accepted' : 'Awaiting Accept' }}</p>
              <p class="reward">Reward: ￡{{ order.commission }}</p>
              <p>Acceptor: {{ order.acceptor }}</p>
              <el-button type="primary" @click="openEditDialog(order)">Edit</el-button>
              <el-button size="small" type="danger" @click="deleteOrder(order)">Delete</el-button>
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

    <!-- 编辑订单对话框 -->
    <el-dialog v-model="editDialogVisible" title="Edit Task">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="Description">
          <el-input v-model="editForm.description" />
        </el-form-item>
        <el-form-item label="Commission">
          <el-input-number v-model="editForm.commission" :min="0" />
        </el-form-item>
        <!-- 你也可添加其他字段，如 destination，images 等 -->
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateTask">Save</el-button>
      </template> 
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import api from '@/api.js'

// 当前选中的标签页
const activeTab = ref('accepted')

// 存储筛选后的订单列表
const acceptedTasks = ref([])
const publishedTasks = ref([])

const editDialogVisible = ref(false)

const editForm = ref({
  id: null,
  description: '',
  commission: 0
})

// 组件挂载时获取所有订单并进行筛选
async function refreshTasks() {
  try {
    const currentUserId = parseInt(localStorage.getItem('userId') || '0', 10)
    const res = await api.get('order/')
    const allOrders = res.data.data || []
    publishedTasks.value = allOrders.filter(order => order.user_id === currentUserId)
    acceptedTasks.value = allOrders.filter(order => order.acceptor === currentUserId && order.status === 1)
  } catch (err) {
    console.error('Failed to refresh tasks:', err)
    ElMessage.error('Failed to fetch orders')
  }
}

onMounted(() => {
  refreshTasks()
})


function openEditDialog(order) {
  editForm.value = {
    id: order.id,
    description: order.description,
    commission: order.commission
  }
  editDialogVisible.value = true
}

async function updateTask() {
  try {
    // 向后端 PATCH /order/{id}/
    const payload = {
      description: editForm.value.description,
      commission: editForm.value.commission
    }
    // 如果你想更新 destination、images 等，也加进 payload
    const res = await api.patch(`order/${editForm.value.id}/`, payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.data.status === 'ok') {
      ElMessage.success('Task updated successfully')
      editDialogVisible.value = false
      // 更新前端显示
      refreshTasks()
    } else {
      ElMessage.error(res.data.message || 'Failed to update task')
    }
  } catch (err) {
    console.error('Failed to update task:', err)
    ElMessage.error('Failed to update task')
  }
}

// async function refreshTasks() {
//   try {
//     const currentUserId = parseInt(localStorage.getItem('userId') || '0', 10)
//     const res = await api.get('order/')
//     const allOrders = res.data.data || []
//     publishedTasks.value = allOrders.filter(o => o.user_id === currentUserId)
//     acceptedTasks.value = allOrders.filter(o => o.acceptor === currentUserId && o.status === 1)
//   } catch (err) {
//     console.error('Failed to refresh tasks:', err)
//   }
// }

function deleteOrder(order) {
  // 弹出确认框
  ElMessageBox.confirm(
    'Are you sure you want to delete this order?',
    'Delete Confirmation',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        // 调用后端 DELETE /order/{id}/
        const res = await api.delete(`order/${order.id}/`)
        // 如果后端成功返回 204 (No Content)
        if (res.status >= 200 && res.status < 300) {
          ElMessage.success('Order deleted successfully')
          // 从 publishedTasks 中移除这条记录，或重新 fetchOrders()
          publishedTasks.value = publishedTasks.value.filter(o => o.id !== order.id)
        } else {
          // 若后端返回别的状态或 body
          ElMessage.error('Failed to delete order')
        }
      } catch (err) {
        console.error('Failed to delete order:', err)
        ElMessage.error('Failed to delete order')
      }
    })
    .catch(() => {
      // 用户取消删除
    })
}

</script>

<style scoped>
@import '../assets/TaskFeed.css';
</style>
