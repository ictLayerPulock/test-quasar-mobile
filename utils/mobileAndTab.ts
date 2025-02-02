export default function () {
    const $q = useQuasar();
    const $device = useDevice();
    const mobileAndTab =
        $q.platform.is.mobile ||
        $q.platform.is.nativeMobile ||
        $q.platform.is.ipad ||
        $q.platform.is.iphone ||
        $device.isMobile ||
        $device.isTablet;
    return mobileAndTab;
}