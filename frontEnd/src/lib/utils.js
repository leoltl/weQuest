export function readFile(file) {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => {
      reader.abort();
    }
    reader.onabort = (e) => {
      reject('Error while loading the file!');
    }
    reader.readAsDataURL(file);

  });
}

export function currencyFormatter(input) {
  return `$${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false
  }).format(input / 100)}`;
}