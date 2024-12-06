import { Button, Input, InputProps } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { TrashIcon } from "../icons/devices/trash-icon"
import { DeleteIcon } from "../icons/table/delete-icon"
import ReactInputMask from "react-input-mask"

export const InputsArray = ({ className, initialValuesAsPlaceholder = false, initialValues, mask = '', masked = false, placeholders = '', onValueChange, min = 1, max = 999, color = 'primary' }: { masked?: boolean, mask?: string, placeholders?: string, className?: string, initialValues: Array<any>, initialValuesAsPlaceholder?: boolean, onValueChange: CallableFunction, min?: number, max?: number, color?: "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined }) => {
    const [values, setValues] = useState(initialValuesAsPlaceholder ? new Array(initialValues.length).fill("") : initialValues)
    useEffect(() => {
        if (values.length < min) {
            setValues([...values, ""])
        }
        if (values.length > max) {
            setValues([...values].splice(values.length, 1))
        }
    }, [values])


    const handleChange = (value: string, index: number) => {
        const newValues = [...values]
        newValues[index] = value
        setValues(newValues)

        onValueChange(newValues)
    }

    const handleAdd = () => {
        if (values.length + 1 > max) return
        const newValues = [...values]
        newValues.push('')
        setValues(newValues)

        onValueChange(newValues)
    }

    const handleRemove = (index: number) => {
        const newValues = [...values]
        newValues.splice(index, 1)
        setValues(newValues)

        onValueChange(newValues)
    }


    return (
        <section className={`${className} flex flex-col gap-2 w-full p-0 m-0 `}>
            {values.map((item, key) => {

                if (masked) {
                    return (
                        <ReactInputMask
                            key={item + key}
                            mask={mask}
                            type="text"
                            onChange={(e) => handleChange(e.target.value, key)}
                            maskChar={''}
                            value={item}>
                            {(inputProps: InputProps) => (

                                <Input {...inputProps} variant="bordered" placeholder={(initialValuesAsPlaceholder ? initialValues[key] : placeholders)} color={color} endContent={<Button isIconOnly variant='light' onClick={() => handleRemove(key)}><DeleteIcon size={20} fill="#FF0080" /></Button>} />
                            )}
                        </ReactInputMask>

                    )
                }
                return (
                    <Input
                        key={item + key}
                        variant="bordered"
                        placeholder={(initialValuesAsPlaceholder ? initialValues[key] : placeholders)}
                        color={color}
                        value={item}
                        onChange={(e) => handleChange(e.target.value, key)}
                        endContent={
                            <Button isIconOnly
                                variant='light'
                                onClick={() => handleRemove(key)}>
                                <DeleteIcon size={20} fill="#FF0080" />
                            </Button>
                        }
                    />)
            })
            }
            <Button onPress={handleAdd} className="font-bold" variant="light" color='success'>+</Button>
        </section>
    )
}