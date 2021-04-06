Number.prototype.unitCelsius = function(){
    return this.valueOf() + ' \u00B0C'
}

Number.prototype.unitFahrenheit = function(){
    return (this.valueOf() * (9/5)) + 32 + ' \u00B0F'
}