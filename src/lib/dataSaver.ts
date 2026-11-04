/** True when the visitor asked the browser to save data. */
export function dataSaverOn(): boolean {
  const { connection } = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  return connection?.saveData === true;
}
