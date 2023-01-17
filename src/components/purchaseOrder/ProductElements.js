import React,{useState,useEffect} from 'react'
import Button from 'react-bootstrap/Button';import Form from 'react-bootstrap/Form';

function ProductElements(props) {

    const [maxValue, setMaxValue]= useState (props.product.amount)
    useEffect(()=> {
        if(!props.unModified){      
            setMaxValue(maxValue)
            props.product.amount = 0
            onInputChange(product.id ,{...product, ...{amount: 0}})
        }
    } ,[])  
    
    const {onInputChange, product, handleInvoiceDelete} = props
    const {id, amount, TVA,prix} = props.product

    function handleChange (changes){
        console.log(maxValue)
        if (changes.amount < 0 ){
            changes.amount = 0
            onInputChange(product.id ,{...product, ...changes})
        }else if(changes.amount > maxValue){
            changes.amount = maxValue
            onInputChange(product.id ,{...product, ...changes})
        }else if (changes.TVA < 0){
            changes.TVA = 0
            onInputChange(product.id ,{...product, ...changes})        
        }else{
            onInputChange(product.id ,{...product, ...changes})
        }
    }
    return (
    <>
    {props.unModified?
    <tr key={props.product.id} style={{backgroundColor: "#eef3f6"}}>
        <td>{props.product.name}</td>
        <td className="center"> {props.product.category} </td>
        <td className="left strong"  > {props?.product?.prix}   </td>
        <td className="right" > {props.product.amount}  </td>  
        <td className="center"> {props.product.TVA}</td>
        <td className="right" > {(product.prix * amount).toFixed(2) } DT</td>
    </tr>  
    :   
    <tr key={props.product.id} style={{backgroundColor: "#eef3f6"}}>
        <td>{props.product.name}</td>
        <td className="center"  > {props.product.category} </td>
        <td className="left strong"  > {props.product.prix}   </td>
        <td className="right">
            <Form.Control style={{width: '12rem'}}
                type="number" aria-valuemin={0} aria-valuemax={3} min={0}  max={maxValue}
                defaultValue={0} 
                value={props.product.amount}
                onInput={e => handleChange({amount: e.target.value})}/>
        </td>  
        <td className="center" >
            <Form.Control style={{width: '12rem'}}
                type="number"  min={0} 
                defaultValue={19} 
                value={props.product.TVA}
                onInput={e => handleChange({TVA:  e.target.value})}/>    </td>
        <td className="right"  > {(product.prix * amount).toFixed(2) } DT</td>
        <td><Button className="ml-4" variant="danger" onClick={()=> handleInvoiceDelete(id)}><i className="fas fa-trash"></i></Button></td>
    </tr>
    }
    </>
    )  
}

export default ProductElements