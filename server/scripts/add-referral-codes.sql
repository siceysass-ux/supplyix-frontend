-- Update existing users with referral codes
UPDATE User 
SET 
    referralCode = 'SUPPLYIX-' || UPPER(SUBSTR(REPLACE(name, ' ', ''), 1, 3)) || CAST(ABS(RANDOM() % 900000 + 100000) AS TEXT),
    referralCount = 0,
    referralRewards = 0
WHERE referralCode IS NULL OR referralCode = '';
