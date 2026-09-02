import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  faceDescriptor: text("face_descriptor"), // JSON string of 128-d array
  department: text("department").notNull(), // 'engine' | 'limbah' | 'management' | 'admin'
  role: text("role").notNull(), // 'operator' | 'supervisor' | 'manager' | 'admin'
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const attendances = sqliteTable("attendances", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  checkIn: integer("check_in", { mode: 'timestamp' }).notNull(),
  shift: text("shift").notNull(), // 'Pagi' | 'Sore' | 'Malam'
  similarityScore: real("similarity_score"),
  status: text("status").notNull(), // 'success' | 'failed'
});

export const engineLogs = sqliteTable("engine_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD
  hour: text("hour").notNull(), // '07:00', '08:00', etc.
  temperatureAmbient: real("temperature_ambient"),
  dayaNyata: real("daya_nyata"),
  dayaSemu: real("daya_semu"),
  dayaReaktif: real("daya_reaktif"),
  powerFactor: real("power_factor"),
  voltage: real("voltage"),
  currentAlternator: real("current_alternator"),
  currentAcb: real("current_acb"),
  exhaustTemp: real("exhaust_temp"),
  speedEngine: real("speed_engine"),
  oilTemperature: real("oil_temperature"),
  oilPressure: real("oil_pressure"),
  mainCircuitWaterTemp: real("main_circuit_water_temp"),
  intakeManifoldTemp: real("intake_manifold_temp"),
  auxiliaryCircuitWaterTemp: real("auxiliary_circuit_water_temp"),
  airTemperature: real("air_temperature"),
  closedLoop: real("closed_loop"),
  throttleSetpoint: real("throttle_setpoint"),
  instability: real("instability"),
  ignitionUnit: real("ignition_unit"),
  tecjetPosition: real("tecjet_position"),
  deltaPOverTecjet: real("delta_p_over_tecjet"),
  fuelTempTecjet: real("fuel_temp_tecjet"),
  pressureGas: real("pressure_gas"),
  gasFlow: real("gas_flow"),
  totalOperationalHour: real("total_operational_hour"),
  totalGeneratedPower: real("total_generated_power"),
  kondisiPendukung: text("kondisi_pendukung"), // JSON string
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const limbahLogs = sqliteTable("limbah_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD
  hour: text("hour").notNull(),
  levelTank1: real("level_tank_1"),
  levelTank2: real("level_tank_2"),
  drainDuration: real("drain_duration"),
  circulationPump: integer("circulation_pump", { mode: 'boolean' }), // 1/0
  addingPump: integer("adding_pump", { mode: 'boolean' }),
  airInjection: real("air_injection"),
  tempOverflow: real("temp_overflow"),
  warnaOverflow: text("warna_overflow"), // 'Bening' | 'Hitam' | 'Keruh'
  phLiquid: real("ph_liquid"),
  unitPompaTambahan: text("unit_pompa_tambahan"), // JSON string
  cekGasLagoon: text("cek_gas_lagoon"),
  remark: text("remark"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const reportApprovals = sqliteTable("report_approvals", {
  id: text("id").primaryKey(),
  reportDate: text("report_date").notNull(), // YYYY-MM-DD
  department: text("department").notNull(), // 'engine' | 'limbah'
  supervisorId: text("supervisor_id").references(() => users.id),
  supervisorSignature: text("supervisor_signature"),
  supervisorApprovedAt: integer("supervisor_approved_at", { mode: 'timestamp' }),
  managerId: text("manager_id").references(() => users.id),
  managerSignature: text("manager_signature"),
  managerApprovedAt: integer("manager_approved_at", { mode: 'timestamp' }),
});
