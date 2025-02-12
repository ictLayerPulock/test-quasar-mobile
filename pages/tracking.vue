<script setup lang="ts">
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const title = "TRACK YOUR ORDER";
const $q = useQuasar();
const isMobileSize = computed(() => $q.screen.width);

const invoiceId = ref(null);
const invoiceIdEnc = ref(null);
const invoiceItems = ref(null);
const invoiceIdError = ref(null);
const phoneError = ref(null);
const invoiceError = ref("");
const mobileNumber = ref(null);
const customerName = ref("");
const customerPhone = ref("");
const customerEmail = ref("");
const customerAddress = ref("");
const cartItemData = ref("");
const coupon_data = ref("");
const selectedLocation = ref("");
const affiliate_id = ref("");

const rows = ref<any>([]);
const getEnvValue = await $fetch("/api/get-env-value", {});

interface CompanyDataType {
    [x: string]: any;
}

const companyData = ref<CompanyDataType>([]);

const invoiceData = ref<InvoiceDataType>([]);

interface InvoiceDataType {
    [x: string]: any;
}

interface PaymentGatewaysType {
    [x: string]: any;
}
const paymentGateways = ref<PaymentGatewaysType>([]);

const columns: any = [
    { name: "name", label: "Item", align: "left", field: "name" },
    { name: "attribute", label: "Attribute", align: "left", field: "attribute" },
    { name: "price", label: "Price", align: "right", field: "price" },
    { name: "qty", label: "Qty", align: "right", field: "qty" },
    { name: "total", label: "Total", align: "right", field: "total" },
];

const clearData = () => {
    companyData.value = [];
    invoiceData.value = [];
    invoiceItems.value = null;
    invoiceIdError.value = null;
    phoneError.value = null;
    invoiceError.value = "";
};

const updateRows = (data: any) => {
    rows.value = data.invoice_items.map((item: any) => ({
        name: item.acc_ledger_name,
        attribute: item.fg_attribute_name,
        price: `${parseFloat(item.price).toFixed(2)} ${config.public.currency}`,
        qty: parseFloat(item.qty).toFixed(2),
        total: `${parseFloat(item.total_price).toFixed(2)} ${config.public.currency
            }`,
    }));

    rows.value.push({
        qty: "Sub Total",
        total: `${parseFloat(data.invoice_data.invoice_total_price).toFixed(2)} ${config.public.currency
            }`,
    });

    if (data.invoice_data.invoice_discount > 0) {
        data.invoice_data.invoice_total_price -= parseFloat(
            data.invoice_data.invoice_discount
        );
        rows.value.push({
            qty: `Discount (${parseFloat(data.invoice_data.invoice_discount).toFixed(
                2
            )})`,
            total: `${parseFloat(data.invoice_data.invoice_total_price).toFixed(2)} ${config.public.currency
                }`,
        });
    }

    if (data.invoice_data.invoice_round_up > 0) {
        data.invoice_data.invoice_total_price -= parseFloat(
            data.invoice_data.invoice_round_up
        );
        rows.value.push({
            qty: `Round Up (${parseFloat(data.invoice_data.invoice_round_up).toFixed(
                2
            )})`,
            total: `${parseFloat(data.invoice_data.invoice_total_price).toFixed(2)} ${config.public.currency
                }`,
        });
    }

    rows.value.push({
        qty: "Grand Total",
        total: `${parseFloat(data.invoice_data.invoice_final_price).toFixed(2)} ${config.public.currency
            }`,
    });
};

const trackOrder = async () => {
    try {
        const { data: response }: any = await useFetch("/api/order-tracking", {
            method: "POST",
            body: {
                invoice_id: invoiceId.value,
                phone: mobileNumber.value,
            },
        });
        const status = response.value.status;
        const message = response.value.message;
        const data = response.value.data;

        if (status === 200) {
            updateRows(data);
            companyData.value = data.company_data;
            invoiceData.value = data.invoice_data;
            invoiceIdEnc.value = invoiceData.value.invoice_id_encrypted;
            invoiceItems.value = data.invoice_items;
            paymentGateways.value = data.payment_gateways;
            invoiceIdError.value = null;
            phoneError.value = null;
            invoiceError.value = "";
        } else {
            clearData();
            invoiceIdError.value = message.invoice_id || "";
            phoneError.value = message.phone || "";
            invoiceError.value = message.error || "";
        }
    } catch (error) {
        clearData();
        invoiceError.value = error as string;
    }
};
</script>

<template>

    <Head>
        <Title>Customer Oder Tracking Page</Title>
    </Head>
    <div>
        <!-- Track Order -->
        <q-card class="q-pa-xs">
            <q-card-section class="q-pa-xs">
                <h6 class="q-ma-xs text-h6 text-primary text-center">
                    {{ title }}
                </h6>
            </q-card-section>
            <q-card-section class="column text-center q-pa-sm q-gutter-md">
                <q-input v-model="invoiceId" class="col" outlined color="primary" type="text"
                    label="Enter Your Order Invoice ID" dense />
                <small v-if="invoiceIdError" class="text-primary text-capitalize q-pl-xs">{{ invoiceIdError
                    }}</small>
                <q-input v-model="mobileNumber" class="col" outlined color="primary" type="text"
                    label="Enter Your Order Mobile Number" hint="Ex:01684639019" dense />
                <small v-if="phoneError" class="text-primary text-capitalize q-pl-xs">{{ phoneError }}</small>
            </q-card-section>
            <q-card-actions class="flex flex-center">
                <q-btn color="primary" style="width: 120px" @click="trackOrder()">
                    Track Order
                </q-btn>
            </q-card-actions>
        </q-card>
        <!-- Track Order Details -->
        <div v-if="companyData.length != 0 && invoiceData.length != 0" class="q-pt-md q-gutter-sm">
            <q-card>
                <q-card-section class="q-pa-sm q-col-gutter-xs text-center">
                    <h3 class="q-ma-none text-h6 text-primary">
                        {{ companyData.setting_backend_company_name }}
                    </h3>
                    <p class="q-ma-none text-body2">{{ companyData.setting_backend_address }}</p>
                    <p class="q-ma-none text-body2"><q-icon size="xs" name="phone" color="primary" />{{
                        companyData.setting_backend_phone }} |
                        <q-icon size="xs" name="alternate_email" color="primary" />{{ companyData.setting_backend_email
                        }}
                    </p>
                    <p class="q-ma-none text-body2"> Invoice No: {{ invoiceData.invoice_id }} | Date:
                        {{ invoiceData.invoice_date }}</p>
                    <p class="q-ma-none text-body2 q-pb-sm"> Bill To: {{ invoiceData.customer_name }} | Phone:
                        {{ invoiceData.customer_phone }} </p>

                    <q-table virtual-scroll flat class="invoice-table" dense separator="cell" bordered
                        :rows-per-page-options="[0]" :virtual-scroll-sticky-size-start="48" row-key="index" title=""
                        :rows="rows" :columns="columns" hide-bottom />
                    <br />
                    <div class="column q-gutter-sm">
                        <div v-if="invoiceData.invoice_due === 0" class="col text-subtitle1 column text-weight-medium">
                            <h3 class="text-bold text-h6 q-pb-xs text-primary q-ma-none"> Full Paid </h3>
                        </div>
                        <div v-else class="col text-subtitle1 column text-weight-medium">
                            <h3 class="text-bold text-h6 q-pb-xs text-primary q-ma-none"> Invoice Due </h3>
                            <span class="text-primary text-h6 text-weight-medium">
                                {{ config.public.currencyBefore }}
                                {{
                                    formatMoney(
                                        invoiceData.invoice_due * 1.0 -
                                        invoiceData.invoice_delivery_fee * 1.0
                                    )
                                }}
                                {{ config.public.currencyAfter }}
                            </span>
                        </div>
                        <div v-show="invoiceData.invoice_delivery_fee > 0 &&
                            invoiceData.invoice_due > 0
                            " class="col column text-weight-medium">
                            <p class="text-bold q-ma-none text-body1 q-pb-xs">
                                Shipping Charge
                            </p>
                            <span class="text-orange-14 text-h5 text-bold">
                                {{ config.public.currencyBefore }}
                                {{ formatMoney(invoiceData.invoice_delivery_fee * 1.0) }}
                                {{ config.public.currencyAfter }}
                            </span>
                        </div>
                        <div v-show="invoiceData.invoice_delivery_fee > 0 &&
                            invoiceData.invoice_due > 0
                            " class="column text-weight-medium">
                            <h5 class="text-h5 q-ma-none q-pb-sm text-primary text-bold">Payable Amount </h5>
                            <span class="text-primary text-h6 text-bold">
                                {{ config.public.currencyBefore }}
                                {{ formatMoney(invoiceData.invoice_due * 1.0) }}
                                {{ config.public.currencyAfter }}
                            </span>
                        </div>
                    </div>
                    <q-card-section v-if="invoiceData.invoice_due > 0" class="row justify-center q-gutter-md">
                        <q-form v-for="payment in paymentGateways" :key="payment.payment_gateway_id"
                            :action="getEnvValue.api_url + '/payment-only'" method="post">
                            <q-input v-model="getEnvValue.c_code" style="display: none" name="company_code" />
                            <q-input v-model="invoiceId" style="display: none" name="invoice_id" />
                            <q-input v-model="payment.payment_gateway_id" style="display: none"
                                name="payment_gateway_id" />
                            <q-btn ref="submit" outline type="submit" color="primary"
                                :label="`PAY WITH: ` + payment.payment_gateway_name" no-caps
                                class="bg-grey-1 shadow-3" />
                        </q-form>
                    </q-card-section>
                    <q-card-section class="row justify-center q-py-none">
                        <NuxtImg loading="lazy" height="50" quality="50" format="webp"
                            src="/images/payment-gateway.webp" alt="payment-gateway" title="payment-gateway" />
                    </q-card-section>
                </q-card-section>
            </q-card>
            <q-card class="q-pa-sm">
                <div :class="isMobileSize <= 450 ? 'q-pl-lg' : ''">
                    <q-timeline :layout="isMobileSize <= 450 ? 'dense' : 'loose'" color="primary">
                        <q-timeline-entry title="Order Placement"
                            :body="invoiceData.invoice_id ? 'Successful' : 'Pending.'"
                            :subtitle="invoiceData.invoice_id ? invoiceData.invoice_date : 'Date Pending'" side="left"
                            icon="looks_one" class="text-caption"
                            :color="invoiceData.invoice_id ? 'green' : 'primary'" />
                        <q-timeline-entry title="Payment Received"
                            :body="invoiceData.payment_received ? 'Total Received: ' + config.public.currencyBefore + formatMoney(invoiceData.payment_received * 1.00) + ' ' + config.public.currencyAfter : 'Total Received: 0' + config.public.currencyBefore + ' ' + config.public.currencyAfter"
                            side="right" icon="looks_two" :color="invoiceData.payment_received ? 'green' : 'primary'" />
                        <q-timeline-entry :title="'Order: ' + invoiceData.invoice_status" side="left" icon="looks_3"
                            :color="invoiceData.payment_received ? 'green' : 'primary'" />
                        <q-timeline-entry title="Order Departure"
                            :body="invoiceData.fg_voucher_type_id ? 'Package In Transit' : 'Pending'"
                            :subtitle="invoiceData.fg_voucher_type_id ? invoiceData.fg_voucher_date : ''" side="right"
                            icon="looks_4" :color="invoiceData.fg_voucher_type_id ? 'green' : 'primary'" />
                        <q-timeline-entry title="Customer Received"
                            :body="invoiceData.delivered_item ? 'Received' : 'Pending'" side="left" icon="looks_5"
                            :subtitle="invoiceData.delivered_item ? 'Item Received: ' + invoiceData.delivered_item : ''"
                            :color="invoiceData.delivered_item ? 'green' : 'primary'" />
                    </q-timeline>
                </div>
            </q-card>
        </div>

    </div>
</template>

<style lang="sass">
.invoice-table
  .q-table__top,

  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #e0e0e0
</style>