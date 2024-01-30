export const capitalizeEachWord = (str) => {
  if(typeof str !== 'string' || str.length === 0){
    return '';
  }

  const words = str.split(' ');

  const capitalizedWords = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return capitalizedWords.join(' ')
}

export const removeMultipleWhitespaces = (value) => {
  if(!value) return;

  let isSpaceAtEnd = false;

  if(value.length > 1 && value[value.length-1] === ' '){
    isSpaceAtEnd = true;
  }

  let trimmedValue = value.split(' ').filter(n => n).join(" ");

  if(isSpaceAtEnd) return trimmedValue + ' ';

  return trimmedValue;
}