export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => {
      reader.abort();
    };
    reader.onabort = e => {
      reject('Error while loading the file!');
    };
    reader.readAsDataURL(file);
  });
}

export function currencyFormatter(input) {
  return `$${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(input / 100)}`;
}

/**
 * Check that string represents an email
 * Regex courtesy of the WHATWG - https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type=email)
 * @param {string} str - Input string.
 * @return boolean.
 */
export function isEmail(str) {
  // return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(str);
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    str,
  );
}

export function arr2Obj(array) {
  return array.reduce((obj, item) => {
    obj[item['id']] = item;
    return obj;
  }, {});
}
