import {
  PAYROLL_PERIOD_ID,
  requireEmploymentType,
  requirePayrollStatus,
  type CreatePayrollLine,
  type CreatePayrollRun,
} from "../domain/payroll";

const SCREEN_ROWS = `
D015|Marta Schmidt|Mini-job|13.90|24|612.00|blocked|Mini-job limit exceeded
D018|Sarah Owusu|Full-time|14.49|95|1376.55|blocked|Work permit expired
D030|Tim Wagner|Part-time|13.50|60|810.00|blocked|Below statutory minimum wage
D001|Ahmed Demir|Part-time|14.85|60|891.00|pending|Awaiting month close
D002|Paul Lang|Full-time|14.74|95|1400.30|pending|Awaiting month close
D003|Zeynep Costa|Full-time|14.36|95|1364.20|pending|Awaiting month close
D004|Emre Vogel|Working Student|14.66|48|703.68|pending|Awaiting month close
D005|Greta Rossi|Midi-job|15.29|71|1085.59|pending|Awaiting month close
D006|Omar Patel|Working Student|14.66|48|703.68|pending|Awaiting month close
D007|Amira Zielinski|Full-time|14.70|95|1396.50|pending|Awaiting month close
D008|Karim Becker|Full-time|14.07|95|1336.65|pending|Awaiting month close
D009|Aylin Richter|Full-time|15.20|95|1444.00|pending|Awaiting month close
D010|Ben Neumann|Full-time|15.15|95|1439.25|pending|Awaiting month close
D011|Maja Hoffmann|Part-time|15.43|60|925.80|pending|Awaiting month close
D012|Nina Klein|Mini-job|13.90|24|571.00|pending|Awaiting month close
D013|Hannah Arslan|Part-time|14.37|60|862.20|pending|Awaiting month close
D014|Mehmet Rahimi|Full-time|13.92|95|1322.40|pending|Awaiting month close
D016|Samuel Mansour|Part-time|15.23|60|913.80|pending|Awaiting month close
D017|Lena Schulz|Part-time|15.43|60|925.80|pending|Awaiting month close
D019|Elif Nasser|Working Student|14.06|48|674.88|pending|Awaiting month close
D020|David Nowak|Part-time|15.33|60|919.80|pending|Awaiting month close
D021|Laura Bianchi|Full-time|15.46|95|1468.70|pending|Awaiting month close
D022|Tariq Haddad|Working Student|15.45|48|741.60|pending|Awaiting month close
D023|Lea Kaya|Full-time|13.98|95|1328.10|pending|Awaiting month close
D024|Lukas Hartmann|Full-time|15.18|95|1442.10|pending|Awaiting month close
D025|Sofia Lindner|Part-time|15.42|60|925.20|pending|Awaiting month close
D026|Leon Weber|Midi-job|14.71|71|1044.41|pending|Awaiting month close
D027|Priya Braun|Part-time|15.35|60|921.00|pending|Awaiting month close
D028|Arjun Çelik|Full-time|14.46|95|1373.70|pending|Awaiting month close
D029|Mila Keller|Full-time|14.16|95|1345.20|pending|Awaiting month close
D031|Julia Aksoy|Part-time|13.99|60|839.40|pending|Awaiting month close
D032|Noah Mensah|Midi-job|14.33|71|1017.43|pending|Awaiting month close
D033|Chiara Fischer|Full-time|14.92|95|1417.40|pending|Awaiting month close
D034|Kofi Wolf|Midi-job|15.37|71|1091.27|pending|Awaiting month close
D035|Felix Kowalski|Part-time|14.76|60|885.60|pending|Awaiting month close
D036|Yusuf Sharma|Working Student|14.92|48|716.16|pending|Awaiting month close
D037|Anna Yilmaz|Mini-job|13.90|24|583.00|pending|Awaiting month close
D038|Ravi Öztürk|Full-time|14.99|95|1424.05|pending|Awaiting month close
D039|Ines Iyer|Part-time|15.07|60|904.20|pending|Awaiting month close
D040|Jonas Krüger|Part-time|15.20|60|912.00|pending|Awaiting month close
D041|Ahmed Demir|Full-time|14.79|95|1405.05|pending|Awaiting month close
D042|Paul Lang|Mini-job|13.90|24|507.00|pending|Awaiting month close
D043|Zeynep Costa|Part-time|14.31|60|858.60|pending|Awaiting month close
D044|Emre Vogel|Working Student|14.81|48|710.88|pending|Awaiting month close
D045|Greta Rossi|Part-time|15.39|60|923.40|pending|Awaiting month close
D046|Omar Patel|Full-time|13.95|95|1325.25|pending|Awaiting month close
D047|Amira Zielinski|Part-time|13.90|60|834.00|pending|Awaiting month close
D048|Karim Becker|Full-time|14.11|95|1340.45|pending|Awaiting month close
D049|Aylin Richter|Part-time|14.29|60|857.40|pending|Awaiting month close
D050|Ben Neumann|Part-time|15.27|60|916.20|pending|Awaiting month close
D051|Maja Hoffmann|Working Student|15.49|48|743.52|pending|Awaiting month close
D052|Nina Klein|Midi-job|14.97|71|1062.87|pending|Awaiting month close
D053|Hannah Arslan|Full-time|14.21|95|1349.95|pending|Awaiting month close
D054|Mehmet Rahimi|Part-time|14.07|60|844.20|pending|Awaiting month close
D055|Marta Schmidt|Full-time|14.89|95|1414.55|pending|Awaiting month close
D056|Samuel Mansour|Part-time|14.48|60|868.80|pending|Awaiting month close
D057|Lena Schulz|Part-time|15.31|60|918.60|pending|Awaiting month close
D058|Sarah Owusu|Part-time|14.66|60|879.60|pending|Awaiting month close
D059|Elif Nasser|Full-time|14.22|95|1350.90|pending|Awaiting month close
D060|David Nowak|Full-time|14.58|95|1385.10|pending|Awaiting month close
D061|Laura Bianchi|Full-time|14.11|95|1340.45|pending|Awaiting month close
D062|Tariq Haddad|Part-time|14.09|60|845.40|pending|Awaiting month close
D063|Lea Kaya|Part-time|15.29|60|917.40|pending|Awaiting month close
D064|Lukas Hartmann|Part-time|14.28|60|856.80|pending|Awaiting month close
D065|Sofia Lindner|Full-time|15.46|95|1468.70|pending|Awaiting month close
D066|Leon Weber|Part-time|15.04|60|902.40|pending|Awaiting month close
D067|Priya Braun|Mini-job|13.90|24|559.00|pending|Awaiting month close
D068|Arjun Çelik|Mini-job|13.90|24|498.00|pending|Awaiting month close
D069|Mila Keller|Full-time|14.69|95|1395.55|pending|Awaiting month close
D070|Tim Wagner|Full-time|14.69|95|1395.55|pending|Awaiting month close
D071|Julia Aksoy|Midi-job|14.86|71|1055.06|pending|Awaiting month close
D072|Noah Mensah|Full-time|15.28|95|1451.60|pending|Awaiting month close
D073|Chiara Fischer|Part-time|15.18|60|910.80|pending|Awaiting month close
D074|Kofi Wolf|Part-time|15.38|60|922.80|pending|Awaiting month close
D075|Felix Kowalski|Full-time|14.38|95|1366.10|pending|Awaiting month close
D076|Yusuf Sharma|Full-time|14.50|95|1377.50|pending|Awaiting month close
D077|Anna Yilmaz|Working Student|14.37|48|689.76|pending|Awaiting month close
D078|Ravi Öztürk|Full-time|14.58|95|1385.10|pending|Awaiting month close
D079|Ines Iyer|Part-time|15.12|60|907.20|pending|Awaiting month close
D080|Jonas Krüger|Full-time|13.96|95|1326.20|pending|Awaiting month close
D081|Ahmed Demir|Mini-job|13.90|24|498.00|pending|Awaiting month close
D082|Paul Lang|Part-time|14.16|60|849.60|pending|Awaiting month close
D083|Zeynep Costa|Working Student|15.24|48|731.52|pending|Awaiting month close
D084|Emre Vogel|Midi-job|14.98|71|1063.58|pending|Awaiting month close
D085|Greta Rossi|Part-time|14.60|60|876.00|pending|Awaiting month close
D086|Omar Patel|Full-time|14.14|95|1343.30|pending|Awaiting month close
D087|Amira Zielinski|Midi-job|14.54|71|1032.34|pending|Awaiting month close
D088|Karim Becker|Part-time|15.18|60|910.80|pending|Awaiting month close
D089|Aylin Richter|Mini-job|13.90|24|553.00|pending|Awaiting month close
D090|Ben Neumann|Full-time|13.98|95|1328.10|pending|Awaiting month close
D091|Maja Hoffmann|Full-time|14.67|95|1393.65|pending|Awaiting month close
`.trim();

export interface PortalPayroll {
  run: CreatePayrollRun;
  lines: CreatePayrollLine[];
}

export function buildPortalPayroll(): PortalPayroll {
  const lines = SCREEN_ROWS.split("\n").map((row, sortOrder) => {
    const [id, name, employmentType, hourlyRate, hours, gross, status, note] = row.split("|");
    if (!id || !name || !employmentType || !hourlyRate || !hours || !gross || !status || !note) {
      throw new Error(`Payroll screen row ${sortOrder + 1} is incomplete`);
    }
    return {
      id,
      periodId: PAYROLL_PERIOD_ID,
      name,
      employmentType: requireEmploymentType(employmentType),
      hourlyRate: Number(hourlyRate),
      hours: Number(hours),
      gross: Number(gross),
      status: requirePayrollStatus(status),
      note,
      sortOrder,
    };
  });

  return {
    run: {
      id: PAYROLL_PERIOD_ID,
      eyebrow: "September 2026, month to date",
      description: "Hours, gross pay and exceptions that must be cleared before the month closes.",
      blockedFoot: "Payroll cannot run for them",
      checklist: [
        { label: "Import time records (start, end, breaks) for all riders", done: true },
        { label: "Reconcile no-shows and late starts with Alnaif", done: false },
        { label: "Check every hourly rate against the 2026 minimum wage (€13.90)", done: false },
        { label: "Check mini-job earnings against the €603 limit", done: false },
        { label: "Resolve blocked riders (right to work, contract)", done: false },
        { label: "Approve overtime above contract hours", done: false },
        { label: "Export to the payroll provider and archive the audit pack", done: false },
      ],
      exceptions: [
        { type: "Below minimum wage", count: 1 },
        { type: "Mini-job limit", count: 1 },
        { type: "Right to work", count: 1 },
      ],
    },
    lines,
  };
}
