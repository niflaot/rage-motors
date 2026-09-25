import type { InputHTMLAttributes, ReactNode } from 'react'

/** Properties accepted by the shared labeled text input. */
interface TextInputFieldProperties extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id'
> {
  /** Validation message announced beneath the input. */
  readonly error?: string | undefined
  /** Stable identifier used to associate the label and error. */
  readonly id: string
  /** Optional secondary copy displayed beside the label. */
  readonly labelHint?: string | undefined
  /** Visible localized field label. */
  readonly label: string
}

/** Renders a labeled input with a reserved accessible validation region. */
const TextInputField = ({
  error,
  id,
  label,
  labelHint,
  ...inputProperties
}: TextInputFieldProperties): ReactNode => {
  const errorId = `${id}-error`

  return (
    <label className='form-field' htmlFor={id}>
      <span className='form-field__label'>
        {label} {labelHint ? <small>{labelHint}</small> : null}
      </span>
      <input
        {...inputProperties}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        id={id}
      />
      <span aria-live='polite' className='form-field__error' id={errorId}>
        {error}
      </span>
    </label>
  )
}

export default TextInputField
