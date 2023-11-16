
import { create } from 'zustand'

interface SearchModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useSearchModal = create<SearchModalStore>(
    (set) => {
        return {
            isOpen: false,
            onOpen: () => set({ isOpen: true }),
            onClose: () => set({ isOpen: false })
            }
    }
)

export default useSearchModal