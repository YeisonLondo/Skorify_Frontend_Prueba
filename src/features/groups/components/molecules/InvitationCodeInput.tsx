'use client';

import { useTranslations } from 'next-intl';
import TextField, { type TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { INVITATION_CONFIG } from '../../constants/invitation';

export type InvitationCodeInputProps = Omit<MuiTextFieldProps, 'variant'> & {
  helperText?: string;
  error?: boolean;
};

export const InvitationCodeInput = ({
  helperText,
  error = false,
  onChange,
  ...rest
}: InvitationCodeInputProps) => {
  const t = useTranslations('groups');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Limpiamos el valor (sin espacios y en mayúsculas)
    const value = e.target.value.replace(/\s+/g, '').toUpperCase();

    // 2. IMPORTANTE: En lu de mutar e.target.value directamente (que a veces da problemas),
    // creamos una copia o simplemente pasamos el evento si el componente es controlado.
    e.target.value = value;

    // 3. Llamamos al onChange original sin usar 'any'
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        {t('join.codeLabel')}
      </Typography>
      <TextField
        {...rest} // Es mejor poner el spread al principio para que onChange no se sobrescriba
        fullWidth
        placeholder={t('enterInvitationCode')}
        inputProps={{
          maxLength: INVITATION_CONFIG.CODE_MAX_LENGTH,
          style: { textTransform: 'uppercase', letterSpacing: '2px' },
        }}
        error={error}
        helperText={helperText}
        onChange={handleChange}
      />
    </Box>
  );
};

export default InvitationCodeInput;
