<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/auth.ts'

const router = useRouter()
const userStore = useUserStore()

interface Plan {
  id: string
  name: string
  price: number
  unit: '月' | '年'
  desc: string
  highlight?: string
  autoRenew?: boolean
  features: string[]
}

const plans: Plan[] = [
  {
    id: 'monthly',
    name: '月付',
    price: 10,
    unit: '月',
    desc: '',
    features: [
      '同步自定义词典/书籍',
      '练习功能与进度统计',
      '词库与文章每日更新',
      '优先客服支持'
    ]
  },
  {
    id: 'monthly-auto',
    name: '连续包月',
    price: 7,
    unit: '月',
    desc: '',
    highlight: '性价比更高',
    autoRenew: true,
    features: [
    ]
  },
  {
    id: 'yearly',
    name: '年度会员',
    price: 100,
    unit: '年',
    desc: '',
    highlight: '年度优惠',
    features: [
    ]
  }
]

function goPurchase(plan: Plan) {
  if (!userStore.isLogin) {
    router.push({path: '/login', query: {redirect: '/vip'}})
    return
  }
  router.push('/user')
}

</script>

<template>
  <BasePage>
    <div class="vip-intro">
      <div class="my-5 flex justify-between">
        <div class="flex items-center text-2xl">
          <IconFluentCrown20Regular class="mr-2 text-yellow-500"/>
          <span>会员介绍</span>
        </div>
        <div class="subtitle">三种方案，按需选择</div>
      </div>

      <div class="plans">
        <div v-for="p in plans" :key="p.id" class="card bg-reverse-white shadow-lg plan">
         <div>
           <div class="plan-head">
             <div class="plan-name">{{ p.name }}</div>
             <div class="price">
               <span class="amount">¥{{ p.price }}</span>
               <span class="unit">/{{ p.unit }}</span>
             </div>
             <div class="desc">{{ p.desc }}</div>
             <div v-if="p.highlight" class="tag">{{ p.highlight }}</div>
           </div>
           <div class="features">
             <div class="feature" v-for="f in p.features" :key="f">
               <IconFluentCheckmarkCircle20Regular class="mr-2 text-green-600"/>
               <span>{{ f }}</span>
             </div>
             <div v-if="p.autoRenew" class="notice">
               <IconFluentArrowRepeatAll20Regular class="mr-2"/>
               开启自动续费，可在账户页随时关闭
             </div>
           </div>
         </div>

          <BaseButton class="w-full mt-4" size="large" type="info" @click="goPurchase(p)">选择</BaseButton>
        </div>
      </div>
    </div>
  </BasePage>

</template>

<style scoped lang="scss">
.vip-intro {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plans {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.plan {
  @apply flex flex-col gap-3 px-6 py-5 justify-between;
}

.plan-head {
  @apply flex flex-col gap-2;
}

.plan-name {
  @apply text-lg font-bold;
}

.price {
  @apply flex items-end gap-1;
}

.amount {
  @apply text-2xl font-500;
}

.unit {
  @apply text-sm text-gray-500;
}

.desc {
  @apply text-sm text-gray-600;
}

.tag {
  @apply text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded w-fit;
}

.features {
  @apply flex flex-col gap-2 mt-2;
}

.feature {
  @apply flex items-center;
}

.notice {
  @apply text-xs text-gray-600 flex items-center;
}

</style>

