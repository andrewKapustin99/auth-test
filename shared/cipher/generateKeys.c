#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <oqs/oqs.h>
#include <string.h>
#include <netinet/in.h>
#include <unistd.h>

napi_value MyFunction(napi_env env, napi_callback_info info)
{
    napi_status status;
    napi_value result;
    size_t public_key_length = OQS_KEM_kyber_768_length_public_key;
    size_t secret_key_length = OQS_KEM_kyber_768_length_secret_key;

    // Вызов функции OQS_init()
    OQS_init();

    // Выделение памяти для public_key
    unsigned char *public_key = calloc(OQS_KEM_kyber_768_length_public_key, 1);
    if (public_key == NULL)
    {
        napi_throw_error(env, NULL, "Ошибка в public_key");
        return NULL;
    }

    // Выделение памяти для secret_key
    unsigned char *secret_key = calloc(OQS_KEM_kyber_768_length_secret_key, 1);
    if (secret_key == NULL)
    {
        napi_throw_error(env, NULL, "Ошибка в secret_key");
        return NULL;
    }

    // // Создание ключей
    if (OQS_KEM_kyber_768_keypair(public_key, secret_key) != OQS_SUCCESS)
    {
        napi_throw_error(env, NULL, "Ошибка при создании ключей");
        return NULL;
    }

    printf("%s\n", public_key);

    napi_value public_key_buffer;
    napi_value secret_key_buffer;

    status = napi_create_buffer_copy(env, public_key_length, public_key, NULL, &public_key_buffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для public_key");
        free(public_key);
        free(secret_key);
        return NULL;
    }

    status = napi_create_buffer_copy(env, secret_key_length, secret_key, NULL, &secret_key_buffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для secret_key");
        free(public_key);
        free(secret_key);
        return NULL;
    }

    // Создание объекта для возврата результатов
    status = napi_create_object(env, &result);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании объекта");
        free(public_key);
        free(secret_key);
        return NULL;
    }
    printf("public_key: %s", public_key);
    printf("public_key_buffer: %s", public_key_buffer);

    // Устанавливаем свойства объекта
    status = napi_set_named_property(env, result, "publicKey", public_key_buffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке свойства publicKey");
        free(public_key);
        free(secret_key);
        return NULL;
    }

    status = napi_set_named_property(env, result, "secretKey", secret_key_buffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке свойства secretKey");
        free(public_key);
        free(secret_key);
        return NULL;
    }

    return result;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, MyFunction, NULL, &fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании функции");
        return NULL;
    }

    status = napi_set_named_property(env, exports, "MyFunction", fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке функции");
        return NULL;
    }

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
