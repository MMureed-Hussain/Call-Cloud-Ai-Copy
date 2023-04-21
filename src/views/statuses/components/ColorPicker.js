/* eslint-disable */

import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

const presetColors = [
    "#1FBC9C",
    "#1CA085",
    "#2ECC70",
    "#27AF60",
    "#3398DB",
    "#2980B9",
    "#A463BF",
    "#8E43AD",
    "#3D556E",
    "#222F3D",
    "#F2C511",
    "#F39C19",
    "#E84B3C",
    "#C0382B",
    "#DDE6E8",
    "#BDC3C8"
];

const ColorPicker = ({ label, handleChange, value }) =>
{

    return (
        <div>
            <div className="mb-1">
                <Label> {label}: </Label>
                <Input
                    name="color"
                    style={{ height: "35px", padding: "5px" }}
                    type="color"
                    className='w-25'
                    value={value}
                    onChange={(e) => handleChange(e)}
                    list="preset-colors"
                />
                <datalist id="preset-colors">
                    {presetColors.map(color => (
                        <option key={color} value={color} style={{ backgroundColor: color }} />
                    ))}
                </datalist>
            </div>
        </div>
    );
}

export default ColorPicker;
