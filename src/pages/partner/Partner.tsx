import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Title from "../../components/pages/Title";
import { ENV as env } from "../../util/env";

const MBD_BASE_PATH = `${env.EBOLLO20.SERVICE.replace(
  /\/+$/,
  ""
)}/organizations/15376371009`;
const MBD_ENDPOINT = `${MBD_BASE_PATH}/mbd`;
const MBD_NOTICE_ENDPOINT = `${MBD_BASE_PATH}/noticeNumbers`;

const DEMO_RETURN_PATHS = {
  cancelUrl: "/demo/payment/cancel",
  errorUrl: "/demo/payment/error",
  successUrl: "/demo/payment/success",
  waitingUrl: "/demo/payment/waiting",
};

const getDemoReturnUrl = (route: string): string => {
  return `${env.AUTH.REDIRECT_URL}#${route}`;
};

interface ReturnUrls {
  cancelUrl: string;
  errorUrl: string;
  successUrl: string;
  waitingUrl: string;
}

interface PaymentNotice {
  amount: number;
  debtor: {
    email: string;
    fullName: string;
    uniqueIdentifier: {
      type: string;
      value: string;
    };
  };
  documentHash: string;
  province: string;
}

interface ApiResult {
  status: number;
  body: string;
}

interface MbdCreationResponse {
  checkoutRedirectUrl: string;
  mbdDownloadLink: string;
  nav: string;
}

const isMbdCreationResponse = (value: unknown): value is MbdCreationResponse =>
  typeof value === "object" &&
  value !== null &&
  "checkoutRedirectUrl" in value &&
  typeof value.checkoutRedirectUrl === "string" &&
  "mbdDownloadLink" in value &&
  typeof value.mbdDownloadLink === "string" &&
  "nav" in value &&
  typeof value.nav === "string";

const getSubscriptionKey = (): string =>
  (
    (window as Window & {
      _env_?: Record<string, string>;
    })._env_?.REACT_APP_EBOLLO20_SUBSCRIPTION_KEY || ""
  ).trim();

const Partner: React.FC = () => {
  const [returnUrls, setReturnUrls] = React.useState<ReturnUrls>(() => ({
    cancelUrl: getDemoReturnUrl(DEMO_RETURN_PATHS.cancelUrl),
    errorUrl: getDemoReturnUrl(DEMO_RETURN_PATHS.errorUrl),
    successUrl: getDemoReturnUrl(DEMO_RETURN_PATHS.successUrl),
    waitingUrl: getDemoReturnUrl(DEMO_RETURN_PATHS.waitingUrl),
  }));
  const [paymentNotice, setPaymentNotice] = React.useState<PaymentNotice>({
    amount: 1600,
    debtor: {
      email: "pagopa-core@pagopa.it",
      fullName: "Mario Rossi",
      uniqueIdentifier: {
        type: "F",
        value: "RSSMRA80A01H501U",
      },
    },
    documentHash: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    province: "RM",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ApiResult | null>(null);
  const [requestError, setRequestError] = React.useState<string | null>(null);
  const [nav, setNav] = React.useState("");
  const [isMbdLoading, setIsMbdLoading] = React.useState(false);
  const [mbdResponse, setMbdResponse] = React.useState<string | null>(null);
  const [mbdError, setMbdError] = React.useState<string | null>(null);
  const [checkoutFallbackUrl, setCheckoutFallbackUrl] = React.useState<
    string | null
  >(null);

  const updateReturnUrl = (field: keyof ReturnUrls, value: string): void => {
    setReturnUrls((current) => ({ ...current, [field]: value }));
  };

  const updateNotice = (
    field: "amount" | "documentHash" | "province",
    value: string
  ): void => {
    setPaymentNotice((current) => ({
      ...current,
      [field]: field === "amount" ? Number(value) : value,
    }));
  };

  const updateDebtor = (field: "email" | "fullName", value: string): void => {
    setPaymentNotice((current) => ({
      ...current,
      debtor: { ...current.debtor, [field]: value },
    }));
  };

  const updateUniqueIdentifier = (
    field: "type" | "value",
    value: string
  ): void => {
    setPaymentNotice((current) => ({
      ...current,
      debtor: {
        ...current.debtor,
        uniqueIdentifier: {
          ...current.debtor.uniqueIdentifier,
          [field]: value,
        },
      },
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);
    setRequestError(null);
    setCheckoutFallbackUrl(null);

    const subscriptionKey = getSubscriptionKey();

    if (!subscriptionKey) {
      setRequestError(
        "La variabile REACT_APP_EBOLLO20_SUBSCRIPTION_KEY non è configurata."
      );
      return;
    }

    const checkoutWindow = window.open("", "_blank");
    setIsLoading(true);
    try {
      const response = await fetch(MBD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Ocp-Apim-Subscription-Key": subscriptionKey.trim(),
        },
        body: JSON.stringify({
          returnUrls,
          paymentNotices: [paymentNotice],
        }),
      });
      const body = await response.text();
      setResult({
        status: response.status,
        body: body || "Risposta senza contenuto.",
      });

      if (!response.ok) {
        checkoutWindow?.close();
        return;
      }

      let responseData: unknown;
      try {
        responseData = JSON.parse(body);
      } catch {
        checkoutWindow?.close();
        setRequestError(
          "La risposta del servizio non contiene un JSON valido."
        );
        return;
      }

      if (!isMbdCreationResponse(responseData)) {
        checkoutWindow?.close();
        setRequestError("La risposta del servizio non contiene i dati attesi.");
        return;
      }

      const checkoutUrl = new URL(responseData.checkoutRedirectUrl);
      if (checkoutUrl.protocol !== "https:") {
        checkoutWindow?.close();
        setRequestError("Il link di checkout ricevuto non è valido.");
        return;
      }

      setNav(responseData.nav);
      setMbdResponse(null);
      setMbdError(null);
      if (checkoutWindow) {
        checkoutWindow.opener = null;
        checkoutWindow.location.href = checkoutUrl.toString();
      } else {
        setCheckoutFallbackUrl(checkoutUrl.toString());
      }
    } catch (error) {
      checkoutWindow?.close();
      setRequestError(
        error instanceof Error
          ? error.message
          : "Errore durante la chiamata al servizio."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMbd = async () => {
    setMbdResponse(null);
    setMbdError(null);

    const subscriptionKey = getSubscriptionKey();
    if (!subscriptionKey) {
      setMbdError(
        "La variabile REACT_APP_EBOLLO20_SUBSCRIPTION_KEY non è configurata."
      );
      return;
    }

    const noticeNumber = nav.trim();
    if (!noticeNumber) {
      setMbdError("Inserisci il NAV per recuperare la marca da bollo.");
      return;
    }

    setIsMbdLoading(true);
    try {
      const response = await fetch(
        `${MBD_NOTICE_ENDPOINT}/${encodeURIComponent(noticeNumber)}/mbd`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
        }
      );
      const body = await response.text();

      if (!response.ok) {
        setMbdError(
          `Richiesta non riuscita (HTTP ${response.status}): ${
            body || response.statusText
          }`
        );
        return;
      }

      try {
        setMbdResponse(JSON.stringify(JSON.parse(body), null, 2));
      } catch {
        setMbdError("La risposta del servizio non è un JSON valido.");
      }
    } catch (error) {
      setMbdError(
        error instanceof Error
          ? error.message
          : "Errore durante il recupero della marca da bollo."
      );
    } finally {
      setIsMbdLoading(false);
    }
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
      <Grid item xs={12}>
        <Title title="Sito del partner" />
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={1} sx={{ p: { xs: 2, md: 4 } }}>
          <form onSubmit={submit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  Dati della richiesta
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="return-urls-content"
                    id="return-urls-header"
                  >
                    <Typography variant="h6" component="h3">
                      Return URLs
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      {(Object.keys(returnUrls) as Array<keyof ReturnUrls>).map(
                        (field) => (
                          <Grid item xs={12} md={6} key={field}>
                            <TextField
                              fullWidth
                              required
                              type="url"
                              label={field}
                              value={returnUrls[field]}
                              onChange={(event) =>
                                updateReturnUrl(field, event.target.value)
                              }
                            />
                          </Grid>
                        )
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="payment-notice-content"
                    id="payment-notice-header"
                  >
                    <Typography variant="h6" component="h3">
                      Avviso di pagamento
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          label="Importo (eurocents)"
                          inputProps={{ min: 1, step: 1 }}
                          value={paymentNotice.amount}
                          onChange={(event) =>
                            updateNotice("amount", event.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          type="email"
                          label="Email del debitore"
                          value={paymentNotice.debtor.email}
                          onChange={(event) =>
                            updateDebtor("email", event.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Nome completo del debitore"
                          value={paymentNotice.debtor.fullName}
                          onChange={(event) =>
                            updateDebtor("fullName", event.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          required
                          label="Tipo identificativo"
                          value={paymentNotice.debtor.uniqueIdentifier.type}
                          onChange={(event) =>
                            updateUniqueIdentifier("type", event.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          required
                          label="Codice identificativo"
                          value={paymentNotice.debtor.uniqueIdentifier.value}
                          onChange={(event) =>
                            updateUniqueIdentifier("value", event.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          required
                          label="Hash del documento"
                          value={paymentNotice.documentHash}
                          onChange={(event) =>
                            updateNotice("documentHash", event.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          required
                          label="Provincia"
                          inputProps={{ maxLength: 2 }}
                          value={paymentNotice.province}
                          onChange={(event) =>
                            updateNotice("province", event.target.value)
                          }
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress color="inherit" size={18} />
                    ) : undefined
                  }
                >
                  {isLoading
                    ? "Invio in corso..."
                    : "Acquista Marca da Bollo Digitale"}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Notice number"
                  value={nav}
                  onChange={(event) => setNav(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  type="button"
                  variant="outlined"
                  disabled={isMbdLoading || !nav.trim()}
                  onClick={fetchMbd}
                  startIcon={
                    isMbdLoading ? (
                      <CircularProgress color="inherit" size={18} />
                    ) : undefined
                  }
                >
                  {isMbdLoading
                    ? "Recupero in corso..."
                    : "Recupera ricevuta Marca da Bollo Digitale"}
                </Button>
              </Grid>
              {checkoutFallbackUrl && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    Il checkout non si è aperto automaticamente.{" "}
                    <a
                      href={checkoutFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apri il checkout
                    </a>
                  </Alert>
                </Grid>
              )}
              {mbdError && (
                <Grid item xs={12}>
                  <Alert severity="error">{mbdError}</Alert>
                </Grid>
              )}
              {mbdResponse && (
                <Grid item xs={12}>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{mbdResponse}</pre>
                </Grid>
              )}
              {requestError && (
                <Grid item xs={12}>
                  <Alert severity="error">{requestError}</Alert>
                </Grid>
              )}
              {result && (
                <Grid item xs={12}>
                  <Alert
                    severity={
                      result.status >= 200 && result.status < 300
                        ? "success"
                        : "error"
                    }
                  >
                    Risposta HTTP {result.status}
                    <pre style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
                      {result.body}
                    </pre>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Partner;
