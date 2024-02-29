#include <node_api.h>
#include <stdio.h>
#include <string.h>
#include <oqs/oqs.h>
#include <node_api.h>

napi_value GetSecretKeyAndCiphertext(napi_env env, napi_callback_info info)
{
    napi_status status;

    // Проверяем количество аргументов
    size_t argc = 2;
    napi_value argv[2];
    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    if (status != napi_ok || argc < 2)
    {
        napi_throw_error(env, NULL, "Ожидались два аргумента типа Buffer.");
        return NULL;
    }

    // Получаем буферы из аргументов
    size_t secretKeyLength;
    unsigned char *secretKeyData;
    status = napi_get_buffer_info(env, argv[0], (void **)&secretKeyData, &secretKeyLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных из Buffer для secret_key.");
        return NULL;
    }

    size_t ciphertextLength;
    unsigned char *ciphertextData;
    status = napi_get_buffer_info(env, argv[1], (void **)&ciphertextData, &ciphertextLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных из Buffer для ciphertext.");
        return NULL;
    }

    // Выделяем память для shared_secret
    unsigned char *shared_secret = calloc(OQS_KEM_kyber_768_length_shared_secret, 1);
    if (shared_secret == NULL)
    {
        napi_throw_error(env, NULL, "Ошибка при выделении памяти для shared_secret.");
        return NULL;
    }

    // Расшифровываем шифртекст и сохраняем результат в shared_secret
    if (OQS_KEM_kyber_768_decaps(shared_secret, ciphertextData, secretKeyData) != OQS_SUCCESS)
    {
        napi_throw_error(env, NULL, "Ошибка при расшифровке шифртекста.");
        free(shared_secret);
        return NULL;
    }

    // Создаем буфер Node.js для возврата shared_secret
    napi_value sharedSecretBuffer;
    status = napi_create_buffer_copy(env, OQS_KEM_kyber_768_length_shared_secret, shared_secret, NULL, &sharedSecretBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для shared_secret.");
        free(shared_secret);
        return NULL;
    }

    // Освобождаем выделенную память
    free(shared_secret);

    return sharedSecretBuffer;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, GetSecretKeyAndCiphertext, NULL, &fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Error creating function");
        return NULL;
    }

    status = napi_set_named_property(env, exports, "GetSecretKeyAndCiphertext", fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Error setting function");
        return NULL;
    }

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)