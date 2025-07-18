import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ReferralCodeValidatorProps {
    referralCode: string;
    onValidationResult: (isValid: boolean, referrer?: any) => void;
}

const ReferralCodeValidator: React.FC<ReferralCodeValidatorProps> = ({ referralCode, onValidationResult }) => {
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<{ valid: boolean; referrer?: any } | null>(null);

    useEffect(() => {
        const validateCode = async () => {
            if (!referralCode) {
                setValidationResult(null);
                onValidationResult(false);
                return;
            }

            setIsValidating(true);
            try {
                const response = await axios.get(`/api/referral/validate/${referralCode}`);
                setValidationResult(response.data);
                onValidationResult(response.data.valid, response.data.referrer);
            } catch (error) {
                setValidationResult({ valid: false });
                onValidationResult(false);
            } finally {
                setIsValidating(false);
            }
        };

        const delayedValidation = setTimeout(validateCode, 300); // Debounce validation
        return () => clearTimeout(delayedValidation);
    }, [referralCode, onValidationResult]);

    if (!referralCode) return null;

    return (
        <div className="referral-validation">
            {isValidating && (
                <p className="validating">Validating referral code...</p>
            )}
            {validationResult && !isValidating && (
                <div className={`validation-result ${validationResult.valid ? 'valid' : 'invalid'}`}>
                    {validationResult.valid ? (
                        <p className="valid-message">
                            ✓ Valid referral code! You were referred by {validationResult.referrer?.fullName}
                        </p>
                    ) : (
                        <p className="invalid-message">
                            ✗ Invalid referral code. Please check and try again.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReferralCodeValidator;
