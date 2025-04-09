import type { RefObject } from 'react'

export const SomethingModal = ({
  $ref,
  _onClearModal,
}: { $ref: RefObject<HTMLDivElement | null>; _onClearModal: () => void }) => {
  return (
    <div className='w-[350px] shadow-md' ref={$ref}>
      <p>Something modal for example</p>
    </div>
  )
}
