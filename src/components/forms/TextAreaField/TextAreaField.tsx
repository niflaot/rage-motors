import type { ReactNode, TextareaHTMLAttributes } from 'react'

/** Properties accepted by the shared labeled multiline field. */
interface TextAreaFieldProperties extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id'
> {
  /** Optional BEM modifier applied to the field wrapper. */
  readonly containerClassName?: string | undefined
  /** Validation message announced beneath the textarea. */
  readonly error?: string | undefined
  /** Stable identifier used to associate the label and error. */
  readonly id: string
  /** Visible localized field label. */
  readonly label: string
}

/** Renders a labeled textarea with a reserved accessible validation region. */
const TextAreaField = ({
  containerClassName,
  error,
  id,
  label,
  ...textareaProperties
}: TextAreaFieldProperties): ReactNode => {
  const errorId = `${id}-error`

  return (
    <label
      className={['form-field', containerClassName].filter(Boolean).join(' ')}
      htmlFor={id}
    >
      <span className='form-field__label'>{label}</span>
      <textarea
        {...textareaProperties}
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

export default TextAreaField
