#include <node_api.h>
#include <stdio.h>
#include <string.h>
#include <oqs/oqs.h>
#include <node_api.h>

// napi_value GetPublicKey(napi_env env, napi_callback_info info)
// {
//     napi_status status;

//     // Проверяем количество аргументов
//     size_t argc = 1;
//     napi_value argv[1];
//     status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
//     if (status != napi_ok || argc < 1)
//     {
//         napi_throw_error(env, NULL, "Ожидался один аргумент типа Buffer.");
//         return NULL;
//     }

//     // Получаем буфер из аргумента
//     size_t publicKeyLength;
//     unsigned char *publicKeyData;
//     status = napi_get_buffer_info(env, argv[0], (void **)&publicKeyData, &publicKeyLength);
//     if (status != napi_ok)
//     {
//         napi_throw_error(env, NULL, "Ошибка при получении данных из Buffer.");
//         return NULL;
//     }

//     // Создаем буфер для возврата public_key
//     napi_value publicKeyBuffer;
//     status = napi_create_buffer_copy(env, publicKeyLength, publicKeyData, NULL, &publicKeyBuffer);
//     if (status != napi_ok)
//     {
//         napi_throw_error(env, NULL, "Ошибка при создании буфера для public_key.");
//         return NULL;
//     }

//     return publicKeyBuffer;
// }

napi_value GetPublicKey(napi_env env, napi_callback_info info)
{
    napi_status status;

    // Проверяем количество аргументов
    size_t argc = 1;
    napi_value argv[1];
    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    if (status != napi_ok || argc < 1)
    {
        napi_throw_error(env, NULL, "Ожидался один аргумент типа Buffer.");
        return NULL;
    }

    // Получаем буфер из аргумента
    size_t publicKeyLength;
    unsigned char *publicKeyData;
    status = napi_get_buffer_info(env, argv[0], (void **)&publicKeyData, &publicKeyLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных из Buffer.");
        return NULL;
    }

    unsigned char *shared_secret = calloc(OQS_KEM_kyber_768_length_shared_secret, 1);
    if (shared_secret == NULL)
    {
        printf("ошибка в shared_secret");
    }
    unsigned char *ciphertext = calloc(OQS_KEM_kyber_768_length_ciphertext, 1);
    if (ciphertext == NULL)
    {
        printf("ошибка в ciphertext");
    }

    do
    {
        if (OQS_KEM_kyber_768_encaps(ciphertext, shared_secret, publicKeyData) != OQS_SUCCESS)
        {
            perror("Ошибка при создании шифртекста");
            return EXIT_FAILURE;
        }
    } while (strlen(shared_secret) != 32);

    napi_value result;
    status = napi_create_object(env, &result);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании объекта для результата.");
        free(shared_secret);
        free(ciphertext);
        return NULL;
    }

    // Создаем буфер для возврата shared_secret
    napi_value sharedSecretBuffer;
    status = napi_create_buffer_copy(env, OQS_KEM_kyber_768_length_shared_secret, shared_secret, NULL, &sharedSecretBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для shared_secret.");
        free(shared_secret);
        free(ciphertext);
        return NULL;
    }

    // Создаем буфер для возврата ciphertext
    napi_value ciphertextBuffer;
    status = napi_create_buffer_copy(env, OQS_KEM_kyber_768_length_ciphertext, ciphertext, NULL, &ciphertextBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для ciphertext.");
        free(shared_secret);
        free(ciphertext);
        return NULL;
    }

    // Устанавливаем свойства объекта
    status = napi_set_named_property(env, result, "shared_secret", sharedSecretBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке свойства shared_secret.");
        free(shared_secret);
        free(ciphertext);
        return NULL;
    }

    status = napi_set_named_property(env, result, "ciphertext", ciphertextBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке свойства ciphertext.");
        free(shared_secret);
        free(ciphertext);
        return NULL;
    }

    // Освобождаем выделенную память
    free(shared_secret);
    free(ciphertext);

    return result;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, GetPublicKey, NULL, &fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Error creating function");
        return NULL;
    }

    status = napi_set_named_property(env, exports, "GetPublicKey", fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Error setting function");
        return NULL;
    }

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
