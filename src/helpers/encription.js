import argon2 from 'argon2';

export const hashData = async (data) => {
  try {
    const hash = await argon2.hash(data);
    return hash;
  } catch (err) {
    console.error('Error while hashing data:', err);
  }
};
