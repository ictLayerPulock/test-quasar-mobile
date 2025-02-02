// app.config.ts
import { defineAppConfig } from "#imports";

export default defineAppConfig({
    // Configure Quasar's Vue plugin (with HMR support)
    nuxtQuasar: {
        sassVariables: true,
        brand: {
            primary: "#d60000",
            secondary: "#00a3a3",
            accent: "#00a300",
            dark: "#000000",
            positive: "#21ba45",
            negative: "#c10015",
            info: "#31ccec",
            warning: "#f2c037",
        },
        extras: {
            font: "roboto-font",
            fontIcons: ["material-icons"],
            animations: "all",
            svgIcons: ["whatsapp.svg", "after-sales-service.svg", "customer-care.svg", "delivery.svg", "payment-made-easy.svg", "shifting.svg", "warranty.svg"]
        },
        plugins: ["Dialog", "LoadingBar", "Notify", "LocalStorage"],
        config: {
            dark: false,
            screen: {
                bodyClasses: true // <<< add this
            }
        },
    }
})
