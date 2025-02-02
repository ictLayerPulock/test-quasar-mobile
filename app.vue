<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<style lang="sass">
/* For Card Border */
.border-all
  border: 0.5px solid #E0E0E0
.border-right
  border-right: 0.5px solid #E0E0E0
.border-bottom
  border-bottom: 0.5px solid #E0E0E0
/* For Gradient Palette */
.gradient
    background: linear-gradient(to top, #FAFAFA 20%, #F5F5F5 50%, #FAFAFA 80%)
.gradient-h
    // background: linear-gradient(to right, #FAFAFA 10%, #F5F5F5 50%, #FAFAFA 90%)
    background: radial-gradient(circle, #e0e0e0 0%, #fbfbfb 100%)
.gradient-h2
    background: linear-gradient(to right, #F5F5F5 20%, #FAFAFA 50%, #F5F5F5 80%)
.gradient-v
    background: linear-gradient(to top, #F5F5F5 20%, #f5f5f5 50%, #FAFAFA 80%)
.gradient-bottom
    // background: linear-gradient(to bottom, #EEEEEE 20%, #f5f5f5 50%, #FFFFFF 80%)
    background: linear-gradient(to bottom, #F5F5F5 20%, #f5f5f5 50%, #FAFAFA 80%)
.gradient-top
    // background: linear-gradient(to bottom, #EEEEEE 20%, #f5f5f5 50%, #FFFFFF 80%)
    background: linear-gradient(to top, #F5F5F5 20%, #f5f5f5 50%, #FAFAFA 80%)
.gradient-right
    background: linear-gradient(to right, #F5F5F5 20%, #f5f5f5 50%, #FAFAFA 80%)
.gradient-left
    background: linear-gradient(to left, #F5F5F5 20%, #f5f5f5 50%, #FAFAFA 80%)
/* For All Sticky Effects */
.sticky-card-filter
    position: -webkit-sticky
    position: sticky
    top: 80px
    z-index: 40
.sticky-card
    position: -webkit-sticky
    position: sticky
    top: 104px
    // z-index: 20
/* Card Shadow Effect */
.shadow-on-hover
    transition-duration: 0.25s
    transition-timing-function: ease-in-out
    // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25), 0 3px 10px 0 rgba(0, 0, 0, 0.25)
.shadow-on-hover:hover
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.25), 0 6px 20px 0 rgba(0, 0, 0, 0.25)
// /* For Footer Desktop */
a
    text-decoration: none
/* For error page */
.saturate
    filter: saturate(0%)
/* For error page */
.saturate-mild
    filter: saturate(70%)
.always_on_top
    z-index: 50
/* For error page */
.container
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    height: 80vh

/* SetProductMenuD.vue components */
.my-menu-link
    color: black
    background: #F9E8E8
/* FooterCalligraphyD.vue components */
.footer-calligraphy
    margin-bottom:-40px
/* For Custom Scroll Bar */
*
    &::-webkit-scrollbar
        width: 4px
        height: 4px
    &::-webkit-scrollbar-track
        background: #f5f5f5
    &::-webkit-scrollbar-thumb
        background-color: #ED1C24
        border: 1px solid #ED1C24

    input
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button
            -webkit-appearance: none
            margin: 0
</style>
