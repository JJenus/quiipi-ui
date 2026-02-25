// src/constants/timezones.ts
import { Timezone } from "@/types";

export const TIMEZONES: Timezone[] = [
  // UTC-10 to UTC-1 (Americas/Pacific)
  { id: 'Pacific/Honolulu', name: 'Hawaii-Aleutian Time', offset: 'UTC-10', label: 'Hawaii Time (HT)' },
  { id: 'America/Anchorage', name: 'Alaska Time', offset: 'UTC-9/UTC-8', label: 'Alaska Time (AKT)' },
  { id: 'America/Juneau', name: 'Alaska Time', offset: 'UTC-9/UTC-8', label: 'Alaska Time (Juneau)' },
  { id: 'America/Los_Angeles', name: 'Pacific Time', offset: 'UTC-8/UTC-7', label: 'Pacific Time (PT)' },
  { id: 'America/Phoenix', name: 'Mountain Time (Arizona)', offset: 'UTC-7', label: 'Mountain Time (AZ, no DST)' },
  { id: 'America/Denver', name: 'Mountain Time', offset: 'UTC-7/UTC-6', label: 'Mountain Time (MT)' },
  { id: 'America/Mexico_City', name: 'Central Time', offset: 'UTC-6/UTC-5', label: 'Central Time (Mexico City)' },
  { id: 'America/Chicago', name: 'Central Time', offset: 'UTC-6/UTC-5', label: 'Central Time (CT)' },
  { id: 'America/Bogota', name: 'Colombia Time', offset: 'UTC-5', label: 'Colombia Time (COT)' },
  { id: 'America/Lima', name: 'Peru Time', offset: 'UTC-5', label: 'Peru Time (PET)' },
  { id: 'America/New_York', name: 'Eastern Time', offset: 'UTC-5/UTC-4', label: 'Eastern Time (ET)' },
  { id: 'America/Santiago', name: 'Chile Time', offset: 'UTC-4/UTC-3', label: 'Chile Time (CLT)' },
  { id: 'America/Sao_Paulo', name: 'Brasilia Time', offset: 'UTC-3', label: 'Brasilia Time (BRT)' },
  { id: 'America/Buenos_Aires', name: 'Argentina Time', offset: 'UTC-3', label: 'Argentina Time (ART)' },
  
  // UTC (Europe/Africa)
  { id: 'Africa/Casablanca', name: 'Western European Time', offset: 'UTC+0/UTC+1', label: 'Western European Time (Casablanca)' },
  { id: 'Europe/London', name: 'Greenwich Mean Time', offset: 'UTC+0/UTC+1', label: 'Greenwich Mean Time (GMT)' },
  
  // UTC+1 to UTC+3 (Europe/Africa)
  { id: 'Africa/Lagos', name: 'West Africa Time', offset: 'UTC+1', label: 'West Africa Time (WAT)' },
  { id: 'Europe/Amsterdam', name: 'Central European Time', offset: 'UTC+1/UTC+2', label: 'Central European Time (Amsterdam)' },
  { id: 'Europe/Berlin', name: 'Central European Time', offset: 'UTC+1/UTC+2', label: 'Central European Time (Berlin)' },
  { id: 'Europe/Brussels', name: 'Central European Time', offset: 'UTC+1/UTC+2', label: 'Central European Time (Brussels)' },
  { id: 'Europe/Madrid', name: 'Central European Time', offset: 'UTC+1/UTC+2', label: 'Central European Time (Madrid)' },
  { id: 'Europe/Paris', name: 'Central European Time', offset: 'UTC+1/UTC+2', label: 'Central European Time (CET)' },
  { id: 'Europe/Rome', name: 'Central European Time', offset: 'UTC+1/UTC+2', label: 'Central European Time (Rome)' },
  { id: 'Europe/Stockholm', name: 'Central European Time', offset: 'UTC+1/UTC+2', label: 'Central European Time (Stockholm)' },
  { id: 'Africa/Cairo', name: 'Eastern European Time', offset: 'UTC+2', label: 'Eastern European Time (Cairo)' },
  { id: 'Africa/Johannesburg', name: 'South Africa Standard Time', offset: 'UTC+2', label: 'South Africa Standard Time (SAST)' },
  { id: 'Europe/Athens', name: 'Eastern European Time', offset: 'UTC+2/UTC+3', label: 'Eastern European Time (EET)' },
  { id: 'Europe/Helsinki', name: 'Eastern European Time', offset: 'UTC+2/UTC+3', label: 'Eastern European Time (Helsinki)' },
  { id: 'Europe/Istanbul', name: 'Turkey Time', offset: 'UTC+3', label: 'Turkey Time (TRT)' },
  { id: 'Europe/Moscow', name: 'Moscow Time', offset: 'UTC+3', label: 'Moscow Time (MSK)' },
  { id: 'Africa/Nairobi', name: 'East Africa Time', offset: 'UTC+3', label: 'East Africa Time (EAT)' },
  
  // UTC+3:30 to UTC+4:30 (Middle East)
  { id: 'Asia/Dubai', name: 'Gulf Standard Time', offset: 'UTC+4', label: 'Gulf Standard Time (GST)' },
  
  // UTC+5 to UTC+6 (South Asia)
  { id: 'Asia/Karachi', name: 'Pakistan Standard Time', offset: 'UTC+5', label: 'Pakistan Standard Time (PKT)' },
  { id: 'Asia/Kolkata', name: 'India Standard Time', offset: 'UTC+5:30', label: 'India Standard Time (IST)' },
  { id: 'Asia/Dhaka', name: 'Bangladesh Standard Time', offset: 'UTC+6', label: 'Bangladesh Standard Time (BST)' },
  
  // UTC+7 to UTC+9 (Southeast/East Asia)
  { id: 'Asia/Bangkok', name: 'Indochina Time', offset: 'UTC+7', label: 'Indochina Time (ICT)' },
  { id: 'Asia/Shanghai', name: 'China Standard Time', offset: 'UTC+8', label: 'China Standard Time (CST)' },
  { id: 'Asia/Singapore', name: 'Singapore Time', offset: 'UTC+8', label: 'Singapore Time (SGT)' },
  { id: 'Australia/Perth', name: 'Australian Western Time', offset: 'UTC+8', label: 'Australian Western Time (AWST)' },
  { id: 'Asia/Seoul', name: 'Korea Standard Time', offset: 'UTC+9', label: 'Korea Standard Time (KST)' },
  { id: 'Asia/Tokyo', name: 'Japan Standard Time', offset: 'UTC+9', label: 'Japan Standard Time (JST)' },
  
  // UTC+9:30 to UTC+11 (Australia/Pacific)
  { id: 'Australia/Adelaide', name: 'Australian Central Time', offset: 'UTC+9:30/UTC+10:30', label: 'Australian Central Time (ACST)' },
  { id: 'Australia/Brisbane', name: 'Australian Eastern Time', offset: 'UTC+10', label: 'Australian Eastern Time (AEST, no DST)' },
  { id: 'Australia/Sydney', name: 'Australian Eastern Time', offset: 'UTC+10/UTC+11', label: 'Australian Eastern Time (AEST)' },
  { id: 'Australia/Melbourne', name: 'Australian Eastern Time', offset: 'UTC+10/UTC+11', label: 'Australian Eastern Time (Melbourne)' },
  
  // UTC+12 to UTC+13 (Pacific)
  { id: 'Pacific/Fiji', name: 'Fiji Time', offset: 'UTC+12', label: 'Fiji Time (FJT)' },
  { id: 'Pacific/Auckland', name: 'New Zealand Time', offset: 'UTC+12/UTC+13', label: 'New Zealand Time (NZST)' },
];

export const getTimezoneById = (id: string): Timezone | undefined => {
  return TIMEZONES.find(tz => tz.id === id);
};