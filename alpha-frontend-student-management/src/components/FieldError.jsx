export default function FieldError( {error} ){
    if(!error) return null
    return (
        <span style={{
            color:'#dc3545', 
            fontSize: '0.825rem', 
            marginTop: '4px', 
            display: 'block'
        }}>
            {error}
        </span>
    )
}