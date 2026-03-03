/**
 * Plan de Cuentas - Manual de Contabilidad SUNAVAL (Mock)
 * Jerarquía y reglas básicas para CBCNV
 */

export const PlanDeCuentas = [
  {
    codigo: "100",
    descripcion: "ACTIVOS",
    tipo: "G",
    saldo: 0,
    subcuentas: [
      {
        codigo: "101",
        descripcion: "DISPONIBILIDADES",
        tipo: "SG",
        saldo: 1500000.00,
        subcuentas: [
          { codigo: "101.01", descripcion: "Caja", tipo: "D", saldo: 50000.00 },
          { codigo: "101.02", descripcion: "Bancos Nacionales", tipo: "D", saldo: 1450000.00 }
        ]
      },
      {
        codigo: "120",
        descripcion: "INVERSIONES VALORES",
        tipo: "SG",
        saldo: 3225000.00,
        subcuentas: [
          { codigo: "120.01", descripcion: "Portafolio T (Comercialización)", tipo: "D", saldo: 1200000.00, reglas: { limiteDias: 90 } },
          { codigo: "120.02", descripcion: "Portafolio PIC (Valor Razonable)", tipo: "D", saldo: 2025000.00, reglas: { valorRazonable: true } }
        ]
      },
      {
        codigo: "135",
        descripcion: "CUENTAS POR COBRAR",
        tipo: "SG",
        saldo: 45000.00,
        subcuentas: [
          {
            codigo: "135.01",
            descripcion: "Comisiones por Cobrar",
            tipo: "D",
            saldo: 45000.00,
            antigüedad: 65,
            provisiónRequerida: 1.0 // 100% si > 60 días
          }
        ]
      }
    ]
  },
  {
    codigo: "200",
    descripcion: "PASIVOS",
    tipo: "G",
    saldo: 850000.00,
    subcuentas: [
      { codigo: "201", descripcion: "OBLIGACIONES CON CLIENTES", tipo: "SG", saldo: 850000.00 }
    ]
  },
  {
    codigo: "300",
    descripcion: "PATRIMONIO",
    tipo: "G",
    saldo: 3965000.00,
    subcuentas: [
      { codigo: "301", descripcion: "CAPITAL PAGADO", tipo: "SG", saldo: 3000000.00 },
      { codigo: "305", descripcion: "RESERVAS", tipo: "SG", saldo: 500000.00 },
      { codigo: "310", descripcion: "RESULTADOS ACUMULADOS", tipo: "SG", saldo: 465000.00 }
    ]
  },
  {
    codigo: "400",
    descripcion: "INGRESOS",
    tipo: "G",
    saldo: 1250000.00,
    subcuentas: [
      { codigo: "401", descripcion: "Comisiones por Operaciones", tipo: "SG", saldo: 950000.00 },
      { codigo: "405", descripcion: "Ingresos por Inversiones (Valor Razonable)", tipo: "SG", saldo: 300000.00 }
    ]
  },
  {
    codigo: "500",
    descripcion: "EGRESOS",
    tipo: "G",
    saldo: 800000.00,
    subcuentas: [
      { codigo: "501", descripcion: "Gastos de Personal", tipo: "SG", saldo: 500000.00 },
      { codigo: "505", descripcion: "Gastos Operativos", tipo: "SG", saldo: 200000.00 },
      { codigo: "510", descripcion: "Impuestos y Tasas SUNAVAL", tipo: "SG", saldo: 100000.00 }
    ]
  }
];
