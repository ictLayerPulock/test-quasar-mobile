export const usePreOrderType = () => useState<number>("preOrderType", () => 0)
export const useSelectedAttrStock = () => useState<number>("selectedAttrStock", () => 0)
export const useSelectedAttr = () => useState<number>("selectedAttr", () => 0)
export const useCartCount = () => useState<number>("cartCount", () => 0)
export const useCustomPrice = () => useState<number>("customPrice", () => 0)
export const useCustomName = () => useState<string>("customName", () => "")
export const useCustomID = () => useState<number>("customID", () => 0)
export const useCustomImgUrl = () => useState<string>("customImgUrl", () => "")
export const useCustomFgImgUrl = () => useState<string>("customFgImgUrl", () => "")

export const useCustomerDeliveryLocation = () => useState<number>("customerDeliveryLocation", () => 0)

export const useCustomizedOption = () => useState<Array<string>>("customizedOption", () => [])

export const useVideoModal = () => useState<boolean>("videoModal", () => false)
export const useShareToEarnModal = () => useState<boolean>("shareToEarnModal", () => false)
export const useCustomerID = () => useState<string>("customerID", () => "")

export const useProductQty = () => useState<number>("productQty", () => 0)

export const useRecentlyViewed = () => useState<Array<string>>("recentlyViewed", () => [])

