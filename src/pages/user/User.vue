<script setup lang="ts">
import {computed, ref} from 'vue'
import {Calendar, CreditCard, Crown} from 'lucide-vue-next'
import {useAuthStore} from '@/stores/auth.ts'
import {useRouter} from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BasePage from "@/components/BasePage.vue";
import {APP_NAME, EMAIL, GITHUB} from "@/config/env.ts";
import BaseButton from "@/components/BaseButton.vue";
import {PASSWORD_CONFIG, PHONE_CONFIG} from "@/config/auth.ts";
import {changeEmailApi, changePhoneApi, setPassword, updateUserInfoApi} from "@/apis/user.ts";
import BaseIcon from "@/components/BaseIcon.vue";
import {CodeType} from "@/types/types.ts";
import FormItem from "@/components/base/form/FormItem.vue";
import Form from "@/components/base/form/Form.vue";
import {FormInstance} from "@/components/base/form/types.ts";
import {codeRules, emailRules, passwordRules, phoneRules, validatePhone} from "@/utils/validation.ts";
import {cloneDeep} from "@/utils";
import Toast from "@/components/base/toast/Toast.ts";
import Code from "@/pages/user/Code.vue";
import {MessageBox} from "@/utils/MessageBox.tsx";

const authStore = useAuthStore()
const router = useRouter()

// Check login state
const isLoggedIn = computed(() => authStore.isLogin)

// Mock subscription data (you can replace with real data from your API)
const subscriptionData = ref({
  plan: 'Premium',
  status: 'active',
  expiresAt: '2025-12-31',
  autoRenew: true,
  paymentMethod: '信用卡 ****1234'
})

// UI state
let showChangePwd = $ref(false)
let showChangeEmail = $ref(false)
let showChangeUsername = $ref(false)
let showChangePhone = $ref(false)
let loading = $ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const contactSupport = () => {
  console.log('Contact support')
}

const leaveTrustpilotReview = () => {
  window.open(GITHUB + '/issues', '_blank')
}


// 修改手机号
// 修改手机号
// 修改手机号
let changePhoneFormRef = $ref<FormInstance>()
let defaultFrom = {oldCode: '', phone: '', code: '', pwd: '',}
let changePhoneForm = $ref(cloneDeep(defaultFrom))
let changePhoneFormRules = {
  oldCode: codeRules,
  phone: [...phoneRules, {
    validator: (rule: any, value: any) => {
      if (authStore.user?.phone && value === authStore.user?.phone) {
        throw new Error('新手机号与原手机号一致')
      }
    }, trigger: 'blur'
  },],
  code: codeRules,
  pwd: passwordRules
}

function showChangePhoneForm() {
  showChangePhone = showChangeUsername = showChangeEmail = showChangePwd = false
  showChangePhone = true
  changePhoneForm = cloneDeep(defaultFrom)
}

function changePhone() {
  changePhoneFormRef.validate(async valid => {
    if (valid) {
      try {
        loading = true
        const res = await changePhoneApi(changePhoneForm)
        if (res.success) {
          Toast.success('修改成功')
          await authStore.fetchUserInfo()
          showChangePhone = false
        } else {
          Toast.error(res.msg || '修改失败')
        }
      } catch (error) {
        Toast.error(error || '修改失败，请重试')
      } finally {
        loading = false
      }
    }
  })
}

// 修改用户名
// 修改用户名
// 修改用户名
let changeUsernameFormRef = $ref<FormInstance>()
let changeUsernameForm = $ref({username: ''})
let changeUsernameFormRules = {
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
}

function showChangeUsernameForm() {
  showChangePhone = showChangeUsername = showChangeEmail = showChangePwd = false
  showChangeUsername = true
  changeUsernameForm = cloneDeep({username: authStore.user?.username ?? '',})
}

function changeUsername() {
  changeUsernameFormRef.validate(async valid => {
    if (valid) {
      try {
        loading = true
        const res = await updateUserInfoApi(changeUsernameForm)
        if (res.success) {
          Toast.success('修改成功')
          await authStore.fetchUserInfo()
          showChangeUsername = false
        } else {
          Toast.error(res.msg || '修改失败')
        }
      } catch (error) {
        Toast.error(error || '修改失败，请重试')
      } finally {
        loading = false
      }
    }
  })
}

// 修改邮箱
// 修改邮箱
// 修改邮箱
let changeEmailFormRef = $ref<FormInstance>()

let changeEmailForm = $ref({
  email: '',
  pwd: '',
  code: '',
})
let changeEmailFormRules = {
  email: [
    ...emailRules, {
      validator: (rule: any, value: any) => {
        if (authStore.user?.email && value === authStore.user?.email) {
          throw new Error('该邮箱与当前一致')
        }
      }, trigger: 'blur'
    }
  ],
  pwd: passwordRules,
  code: codeRules,
}

function showChangeEmailForm() {
  showChangePhone = showChangeUsername = showChangeEmail = showChangePwd = false
  showChangeEmail = true
  changeEmailForm = cloneDeep({email: authStore.user?.email ?? '', pwd: '', code: '',})
}

function changeEmail() {
  changeEmailFormRef.validate(async valid => {
    if (valid) {
      try {
        loading = true
        const res = await changeEmailApi(changeEmailForm)
        if (res.success) {
          Toast.success('修改成功')
          await authStore.fetchUserInfo()
          showChangeEmail = false
        } else {
          Toast.error(res.msg || '修改失败')
        }
      } catch (error) {
        Toast.error(error || '修改失败，请重试')
      } finally {
        loading = false
      }
    }
  })
}

// 修改密码
// 修改密码
// 修改密码
let changePwdFormRef = $ref<FormInstance>()
const defaultChangePwdForm = {
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
}
let changePwdForm = $ref(cloneDeep(defaultChangePwdForm))
let changePwdFormRules = {
  oldPwd: passwordRules,
  newPwd: passwordRules,
  confirmPwd: [
    {required: true, message: '请再次输入新密码', trigger: 'blur'},
    {
      validator: (rule: any, value: any) => {
        if (value !== changePwdForm.newPwd) {
          throw new Error('两次密码输入不一致')
        }
      }, trigger: 'blur'
    },
  ],
}

function showChangePwdForm() {
  showChangePhone = showChangeUsername = showChangeEmail = showChangePwd = false
  showChangePwd = true
  changePwdForm = cloneDeep(defaultChangePwdForm)
}

function changePwd() {
  changePwdFormRef.validate(async valid => {
    if (valid) {
      try {
        loading = true
        const res = await setPassword(changePwdForm)
        if (res.success) {
          Toast.success('密码设置成功，请重新登录')
          showChangePwd = false
          authStore.logout()
        } else {
          Toast.error(res.msg || '设置失败')
        }
      } catch (error) {
        Toast.error(error || '设置密码失败，请重试')
      } finally {
        loading = false
      }
    }
  })
}

</script>

<template>
  <BasePage>
    <!-- Unauthenticated View -->
    <div v-if="!isLoggedIn" class="center h-screen">
      <div class="card shadow-lg text-center flex-col gap-6 w-100 ">
        <div class="w-20 h-20 bg-blue-100 rounded-full center mx-auto">
          <IconFluentPerson20Regular class="text-3xl text-blue-600"/>
        </div>
        <h1 class="text-2xl font-bold">欢迎使用</h1>
        <p class="">请登录以管理您的账户</p>
        <BaseButton
          @click="router.push('/login')"
          size="large"
          class="w-full mt-4"
        >
          登录
        </BaseButton>
        <p class="text-sm text-gray-500">
          还没有账户？
          <router-link to="/login" class="line">立即注册</router-link>
        </p>
      </div>
    </div>

    <!-- Authenticated View -->
    <div v-else class="w-full flex gap-4">
      <!-- Main Account Settings -->
      <div class="card flex-1 flex flex-col gap-2 px-6">
        <h1 class="text-2xl font-bold mt-0">帐户</h1>

        <!--        用户名-->
        <div class="item">
          <div class="flex-1">
            <div class="mb-2">用户名</div>
            <div class="flex items-center gap-2" v-if="authStore.user?.username">
              <IconFluentPerson20Regular class="text-base"/>
              <span>{{ authStore.user?.username }}</span>
            </div>
            <div v-else class="text-xs">在此设置用户名</div>
          </div>
          <BaseIcon @click="showChangeUsernameForm">
            <IconFluentTextEditStyle20Regular/>
          </BaseIcon>
        </div>
        <div v-if="showChangeUsername">
          <Form
            ref="changeUsernameFormRef"
            :rules="changeUsernameFormRules"
            :model="changeUsernameForm">
            <FormItem prop="username">
              <BaseInput
                v-model="changeUsernameForm.username"
                type="text"
                size="large"
                placeholder="请输入用户名"
                autofocus
              >
                <template #preIcon>
                  <IconFluentPerson20Regular class="text-base"/>
                </template>
              </BaseInput>
            </FormItem>
          </Form>
          <div class="text-align-end mb-2">
            <BaseButton type="info" @click="showChangeUsername = false">取消</BaseButton>
            <BaseButton @click="changeUsername">保存</BaseButton>
          </div>
        </div>
        <div class="line"></div>

        <!--        手机号-->
        <div class="item">
          <div class="flex-1">
            <div class="mb-2">手机号</div>
            <div class="flex items-center gap-2" v-if="authStore.user?.phone">
              <IconFluentMail20Regular class="text-base"/>
              <span>{{ authStore.user?.phone }}</span>
            </div>
            <div v-else class="text-xs">在此设置手机号</div>
          </div>
          <BaseIcon @click="showChangePhoneForm">
            <IconFluentTextEditStyle20Regular/>
          </BaseIcon>
        </div>
        <div v-if="showChangePhone">
          <Form
            ref="changePhoneFormRef"
            :rules="changePhoneFormRules"
            :model="changePhoneForm">
            <FormItem prop="oldCode" v-if="authStore.user?.phone">
              <div class="flex gap-2">
                <BaseInput
                  v-model="changePhoneForm.oldCode"
                  type="code"
                  autofocus
                  placeholder="请输入原手机号验证码"
                  :max-length="PHONE_CONFIG.codeLength"
                />
                <Code :validate-field="() => true"
                      :type="CodeType.ChangePhoneOld"
                      :val="authStore.user.phone"/>
              </div>
            </FormItem>
            <FormItem prop="phone">
              <BaseInput
                v-model="changePhoneForm.phone"
                type="tel"
                size="large"
                placeholder="请输入新手机号"
              />
            </FormItem>
            <FormItem prop="code">
              <div class="flex gap-2">
                <BaseInput
                  v-model="changePhoneForm.code"
                  type="code"
                  placeholder="请输入新手机号验证码"
                  :max-length="PHONE_CONFIG.codeLength"
                />
                <Code :validate-field="() => changePhoneFormRef.validateField('phone')"
                      :type="CodeType.ChangePhoneNew"
                      :val="changePhoneForm.phone"/>
              </div>
            </FormItem>
            <FormItem prop="pwd" v-if="!authStore.user?.phone">
              <BaseInput
                v-model="changePhoneForm.pwd"
                type="password"
                size="large"
                placeholder="请输入原密码"
              />
            </FormItem>
          </Form>
          <div class="flex justify-between items-end mb-2">
            <span class="link text-sm cp"
                  @click="MessageBox.notice(`请提供证明信息发送邮件到 ${EMAIL} 进行申诉`,'人工申诉')"
                  v-if="authStore.user?.phone">原手机号不可用，点此申诉</span>
            <span v-else></span>
            <div>
              <BaseButton type="info" @click="showChangePhone = false">取消</BaseButton>
              <BaseButton @click="changePhone">保存</BaseButton>
            </div>
          </div>
        </div>
        <div class="line"></div>

        <!-- Email Section -->
        <div class="item">
          <div class="flex-1">
            <div class="mb-2">电子邮箱</div>
            <div class="flex items-center gap-2" v-if="authStore.user?.email">
              <IconFluentMail20Regular class="text-base"/>
              <span>{{ authStore.user?.email }}</span>
            </div>
            <div v-else class="text-xs">在此设置邮箱</div>
          </div>
          <BaseIcon @click="showChangeEmailForm">
            <IconFluentTextEditStyle20Regular/>
          </BaseIcon>
        </div>
        <div v-if="showChangeEmail">
          <Form
            ref="changeEmailFormRef"
            :rules="changeEmailFormRules"
            :model="changeEmailForm">
            <FormItem prop="email">
              <BaseInput
                v-model="changeEmailForm.email"
                type="email"
                size="large"
                placeholder="请输入邮箱地址"
                autofocus
              />
            </FormItem>
            <FormItem prop="code">
              <div class="flex gap-2">
                <BaseInput
                  v-model="changeEmailForm.code"
                  type="code"
                  placeholder="请输入验证码"
                  :max-length="PHONE_CONFIG.codeLength"
                />
                <Code :validate-field="() => changeEmailFormRef.validateField('email')"
                      :type="CodeType.ChangeEmail"
                      :val="changeEmailForm.email"/>
              </div>
            </FormItem>
            <FormItem prop="pwd" v-if="authStore.user?.hasPwd">
              <BaseInput
                v-model="changePwdForm.pwd"
                type="password"
                size="large"
                placeholder="请输入密码"
              />
            </FormItem>
          </Form>
          <div class="text-align-end mb-2">
            <BaseButton type="info" @click="showChangeEmail = false">取消</BaseButton>
            <BaseButton @click="changeEmail">保存</BaseButton>
          </div>
        </div>
        <div class="line"></div>


        <!-- Password Section -->
        <div class="item cp" @click="showChangePwdForm">
          <div class="flex-1">
            <div class="mb-2">设置密码</div>
            <div class="text-xs">在此输入密码</div>
          </div>
          <IconFluentChevronLeft28Filled
            class="transition-transform"
            :class="['rotate-270','rotate-180'][showChangePwd?0:1]"/>
        </div>
        <div v-if="showChangePwd">
          <Form
            ref="changePwdFormRef"
            :rules="changePwdFormRules"
            :model="changePwdForm">
            <FormItem prop="oldPwd" v-if="authStore.user.hasPwd">
              <BaseInput
                v-model="changePwdForm.oldPwd"
                placeholder="旧密码"
                type="password"
                size="large"
                autofocus
              />
            </FormItem>

            <FormItem prop="newPwd">
              <BaseInput
                v-model="changePwdForm.newPwd"
                type="password"
                size="large"
                :placeholder="`请输入新密码（${PASSWORD_CONFIG.minLength}-${PASSWORD_CONFIG.maxLength}位）`"
                :min="PASSWORD_CONFIG.minLength"
                :max="PASSWORD_CONFIG.maxLength"
              />
            </FormItem>
            <FormItem prop="confirmPwd">
              <BaseInput
                v-model="changePwdForm.confirmPwd"
                type="password"
                size="large"
                placeholder="请再次输入新密码"
                :min="PASSWORD_CONFIG.minLength"
                :max="PASSWORD_CONFIG.maxLength"
              />
            </FormItem>
          </Form>
          <div class="text-align-end mb-2">
            <BaseButton type="info" @click="showChangePwd = false">取消</BaseButton>
            <BaseButton :loading="loading" @click="changePwd">保存</BaseButton>
          </div>
        </div>
        <div class="line"></div>


        <!-- Contact Support -->
        <div class="item cp"
             @click="contactSupport">
          <div class="flex-1">
            联系 {{ APP_NAME }} 客服
          </div>
          <IconFluentChevronLeft28Filled class="rotate-180"/>
        </div>
        <div class="line"></div>

        <!-- Trustpilot Review -->
        <div class="item cp"
             @click="leaveTrustpilotReview">
          <div class="flex-1">
            给 {{ APP_NAME }} 提交意见
          </div>
          <IconFluentChevronLeft28Filled class="rotate-180"/>
        </div>
        <div class="line"></div>

        <!-- Logout Button -->
        <div class="center w-full mt-4">
          <BaseButton
            @click="handleLogout"
            size="large"
            class="w-[80%]"
          >
            登出
          </BaseButton>
        </div>

        <div class="text-xs text-center mt-2">
          <a href="/user-agreement.html" target="_blank" class="text-gray-500 hover:text-gray-700">用户协议</a>
          、
          <a href="/privacy-policy.html" target="_blank" class="text-gray-500 hover:text-gray-700">隐私政策</a>
        </div>
      </div>

      <!-- Subscription Information -->
      <div class="card w-80">
        <div class="flex items-center gap-3 mb-4">
          <Crown class="w-6 h-6 text-yellow-500"/>
          <h2 class="text-lg font-bold text-gray-900">订阅信息</h2>
        </div>

        <div class="space-y-4">
          <div>
            <div class="text-sm text-gray-500 mb-1">当前计划</div>
            <div class="text-lg font-semibold text-gray-900">{{ subscriptionData.plan }}</div>
          </div>

          <div>
            <div class="text-sm text-gray-500 mb-1">状态</div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium text-green-700">{{
                  subscriptionData.status === 'active' ? '活跃' : '已过期'
                }}</span>
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500 mb-1">到期时间</div>
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-gray-400"/>
              <span class="text-sm font-medium text-gray-900">{{ subscriptionData.expiresAt }}</span>
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500 mb-1">自动续费</div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2" :class="subscriptionData.autoRenew ? 'bg-blue-500' : 'bg-gray-400'"
                   rounded-full></div>
              <span class="text-sm font-medium"
                    :class="subscriptionData.autoRenew ? 'text-blue-700' : 'text-gray-600'">
                    {{ subscriptionData.autoRenew ? '已开启' : '已关闭' }}
                  </span>
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500 mb-1">付款方式</div>
            <div class="flex items-center gap-2">
              <CreditCard class="w-4 h-4 text-gray-400"/>
              <span class="text-sm font-medium text-gray-900">{{ subscriptionData.paymentMethod }}</span>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <BaseButton class="w-full">管理订阅</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </BasePage>
</template>
<style scoped lang="scss">
.item {
  @apply flex items-center justify-between min-h-14;
}
</style>