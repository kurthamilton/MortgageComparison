var calc = new MPay.Calculator(-180000);
calc.addMortgage(2.34 / 100, 1000, false, 36);
calc.calculate(36, 1000);
console.log(calc.monthlyPayments);