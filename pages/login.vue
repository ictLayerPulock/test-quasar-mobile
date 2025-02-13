<template>
  <Head>
    <Title>Customer Login Page</Title>
  </Head>
  <div>
    <div>
      <q-card class="q-pa-none shadow-5" rounded>
        <q-card-section class="q-pa-none">
          <q-tabs v-model="tab" narrow-indicator>
            <q-tab class="text-primary" name="login" label="login" />
            <q-tab class="text-primary" name="register" label="register" />
          </q-tabs>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-tab-panels v-model="tab" animated transition-prev="scale" transition-next="scale" class="text-center">
            <q-tab-panel name="login" class="q-gutter-y-md">
              <q-input filled v-model="username" type="email" label="Email / Mobile Number" placeholder="example@mail.com" dense>
                <template v-slot:prepend>
                  <q-icon size="xs" name="mail" />
                </template>
              </q-input>
              <small v-if="usernameError" class="text-primary text-capitalize q-pl-sm">{{ usernameError }}</small>
              <q-input v-model="passCode" filled :type="isPwd ? 'password' : 'text'" label="Password"
                placeholder="Enter Password" dense>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" size="xs" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <small v-if="passCodeError" class="text-primary text-capitalize q-pl-sm">{{ passCodeError }}</small>
              <small v-if="loginError" class="text-primary text-capitalize q-pl-sm">{{ loginError }}</small>
              <div class="row justify-end text-secondary"  @click="navigateTo('/forget-password/')">
                <p class="q-ma-none text-italic">Forget Password</p>
              </div>
              <div class="row justify-center">
                <q-btn color="primary" @click="handleLogin()">
                  Login
                </q-btn>
              </div>
            </q-tab-panel>
            <!-- Register Section -->
            <q-tab-panel name="register" class="q-gutter-y-md">
              <q-input filled v-model="customerName" type="text" label="Name*" placeholder="Please enter your name" dense>
                <template v-slot:prepend>
                  <q-icon size="xs" name="person" />
                </template>
              </q-input>
              <small v-if="nameError" class="text-primary text-capitalize q-pl-sm">{{ nameError }}</small>
              <q-input filled v-model="customerPhone" type="text" label="Mobile Number*" placeholder="017XXXXXXXX" dense>
                <template v-slot:prepend>
                  <q-icon size="xs" name="phone" />
                </template>
              </q-input>
              <small v-if="phoneError" class="text-primary text-capitalize q-pl-sm">{{ phoneError }}</small>
              <q-input filled v-model="customerEmail" type="email" label="Email" placeholder="example@mail.com" dense>
                <template v-slot:prepend>
                  <q-icon size="xs" name="mail" />
                </template>
              </q-input>
              <small v-if="emailError" class="text-primary text-capitalize q-pl-sm">{{ emailError }}</small>
              <q-input v-model="customerPassword" filled :type="isPwd ? 'password' : 'text'" label="Password*"
                placeholder="Enter Password" dense>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" size="xs" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <small v-if="passwordError" class="text-primary text-capitalize q-pl-sm">{{ passwordError }}</small>
              <q-input filled v-model="customerAddress" type="text" maxlength="255" autogrow label="Address Details"
                placeholder="Please enter your address details" dense
                hint="Example: Apt Number, House Number, Street Name or Number, Block or Area or Moholla, District">
                <template v-slot:prepend>
                  <q-icon size="xs" name="home" />
                </template>
              </q-input>
              <div :class="addressError ? 'q-pt-xs' : ''">
                <small v-if="addressError" class="text-primary text-capitalize">{{ addressError }}</small>
              </div>
              <!-- Delivery Location -->
              <q-input v-model="selected" standout type="text" dense readonly required
                @click="deliveryLocationModal = true" />
              <small v-if="regError" class="text-primary text-capitalize q-pl-sm">{{ regError }}</small>
              <div class="row justify-center">
                <q-btn color="primary" @click="handleRegistration()">
                  Register
                </q-btn>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
      <!-- Delivery Location Modal -->
      <q-dialog v-model="deliveryLocationModal" position="bottom">
        <q-card flat bordered style="width: 350px">
          <q-card-section class="q-pa-sm">
            <p class="text-body2 q-ma-none text-center">
              Delivery Location
            </p>
          </q-card-section>
          <q-card-section class="q-py-none q-px-sm">
            <q-input ref="filterRef" v-model="filter" class="bg-white" dense outlined label="Search Location">
              <template #append>
                <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
              </template>
            </q-input>
            <q-scroll-area style="height: 250px;" class="q-pa-sm">
              <q-tree class="text-capitalize text-body2" default-expand-all dense :nodes="locationJson" :filter="filter"
                node-key="label" label-key="label" color="primary">
                <template #header-select="prop">
                  <q-radio v-model="selected" size="xs" :val="prop.node.chain" :label="prop.node.label"
                    @click="locationChanged(prop.node.id)" />
                </template>
              </q-tree>
            </q-scroll-area>
          </q-card-section>
          <q-card-actions class="row q-pb-sm flex flex-center">
            <q-btn v-close-popup outline color="primary" label="Close" style="width: 120px" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const baseURL = config.public.baseURL;

const password = ref("")
const isPwd = ref(true)

const route = useRoute()

const filter = ref("")
const filterRef = ref<any>(null)

function resetFilter() {
  filter.value = ""
  filterRef.value.focus()
}

const selected = ref("Choose Delivery Location / Area / Landmark*")
const deliveryLocationModal = ref(false)
const selectedLocation = ref(0)

function locationChanged(id: number) {
  selectedLocation.value = id
}

// fetch location tree ↓↓↓↓

const locationJson = ref([])

// fetch location tree ↑↑↑↑
onMounted(async () => {
  const response: any = await $fetch("/api/get-location-chain", {
    method: "POST",
  })

  locationJson.value = response.data

  if (localStorage.getItem("auth_customer_data")) {
    if (route.name === "login") {
      window.history.back()
    }
  }
})

// State for login form
const tab = ref("login")
const username = ref("")
const passCode = ref("")
const usernameError = ref("")
const passCodeError = ref("")
const loginError = ref("")

// State for registration form
const customerName = ref("")
const customerPhone = ref("")
const customerEmail = ref("")
const customerPassword = ref("")
const customerAddress = ref("")
const nameError = ref("")
const phoneError = ref("")
const emailError = ref("")
const passwordError = ref("")
const addressError = ref("")
const locationError = ref("")
const regError = ref("")

// Function to handle login
const handleLogin = async () => {
  try {
    const { data: response }: any = await useFetch("/api/login", {
      method: "POST",
      body: {
        username: username.value,
        password: passCode.value,
      },
    })
    const status = response.value.status
    const message = response.value.message
    const data = response.value.data

    if (status === 200) {

      localStorage.removeItem("auth_customer_data")
      localStorage.setItem("auth_customer_data", JSON.stringify(data))

      if (route.redirectedFrom) {
        navigateTo(route.redirectedFrom)
      } else {
        // window.location.href = '/customer/accounts';
        // window.history.back()
        location.href = document.referrer
      }

    } else {
      usernameError.value = message.username || ""
      passCodeError.value = message.password || ""
      loginError.value = message.error || ""
    }
  } catch (error) {
    loginError.value = "Something went wrong."
    console.error("Login error:", error)
  }
}

// Function to handle registration
const handleRegistration = async () => {
  try {
    const { data: response }: any = await useFetch("/api/registration", {
      method: "POST",
      body: {
        name: customerName.value,
        phone: customerPhone.value,
        email: customerEmail.value,
        password: customerPassword.value,
        address: customerAddress.value,
        location: selectedLocation.value == 0 ? "" : selectedLocation.value
      },
    })
    const status = response.value.status
    const message = response.value.message
    const data = response.value.data

    if (status === 200) {
      localStorage.removeItem("auth_customer_data")
      localStorage.setItem("auth_customer_data", JSON.stringify(data))
      if (route.redirectedFrom) {
        navigateTo(route.redirectedFrom)
      } else {
        window.location.href = "/customer/accounts"
      }

    } else {
      nameError.value = message.name || ""
      phoneError.value = message.phone || ""
      emailError.value = message.email || ""
      passwordError.value = message.password || ""
      addressError.value = message.address || ""
      locationError.value = message.location || ""
      regError.value = message.error || ""
    }
  } catch (error) {
    regError.value = "Something went wrong."
    console.error("Registration error:", error)
  }
}
</script>
