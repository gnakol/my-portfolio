export interface Dashboard {
  system: {
    cpuLoad: number | null;
    heapUsedBytes: number;
    heapMaxBytes: number;
    totalDiskBytes: number;
    freeDiskBytes: number;
  } | null;

  availability: {
    checkedAt: string;
    uptimeMs: number;
    errors5xxLast5m: number;
    errors5xxLast60m: number;
    ok: boolean;
    message: string;
  } | null;

  security: {
    tls: Array<{
      target: string;
      daysLeft: number | null;
      ok: boolean;
      message: string;
      checkedAt: string;
    }>;
  } | null;

  maintenance: {
    lastBackupAt: string | null;
    lastBackupOk: boolean | null;
    lastBackupSizeBytes: number | null;
    lastBackupFile: string | null;
  } | null;
}
