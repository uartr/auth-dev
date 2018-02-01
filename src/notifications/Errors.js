import React, { PropTypes } from 'react'

const Errors = (props) => {
  const { errors } = props
  return (
    <div>
      <ul>
        {errors.map(errors => (
          <li key={errors.time}>{errors.body}</li>
        ))}
      </ul>
    </div>
  )
}

Errors.propTypes = {
  errors: PropTypes.arrayOf(
      PropTypes.shape({
        body: PropTypes.string,
        time: PropTypes.date,
      })),
}

export default Errors
